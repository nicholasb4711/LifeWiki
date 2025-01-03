"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { trackActivity } from "@/app/actions/analytics";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};


export const createWikiAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  // check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const isPublic = formData.get("isPublic")?.toString() === "true";
  const tags = formData.get("tags")?.toString().split(",").filter(Boolean) || [];

  if (!title) {
    return encodedRedirect("error", "/wikis/new", "Title is required");
  }

  // Start a transaction
  const { data: wiki, error: wikiError } = await supabase
    .from("wikis")
    .insert({
      title,
      description,
      is_public: isPublic,
      user_id: user.id,
    })
    .select()
    .single();

  if (wikiError) {
    return encodedRedirect("error", "/wikis/new", "Failed to create wiki");
  }

  // Handle tags
  if (tags.length > 0) {
    // First, ensure all tags exist
    const { data: existingTags } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", tags);

    const existingTagNames = existingTags?.map(t => t.name) || [];
    const newTags = tags.filter(t => !existingTagNames.includes(t));

    // Create new tags
    if (newTags.length > 0) {
      const { error: tagError } = await supabase
        .from("tags")
        .insert(newTags.map(name => ({
          name,
          user_id: user.id
        })));

      if (tagError) {
        console.error("Error creating tags:", tagError);
      }
    }

    // Get all tag IDs (both existing and newly created)
    const { data: allTags } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", tags);

    // Associate tags with wiki
    if (allTags) {
      const { error: linkError } = await supabase
        .from("wiki_tags")
        .insert(allTags.map(tag => ({
          wiki_id: parseInt(wiki.id),
          tag_id: tag.id
        })));

      if (linkError) {
        console.error("Error linking tags:", linkError);
      }
    }
  }

  // Track activity
  await trackActivity('create_wiki', 'wiki', wiki.id);

  return encodedRedirect("success", `/wikis/${wiki.id}`, "Wiki created successfully");
}

export const createPageAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const wikiId = formData.get("wikiId")?.toString();
  const title = formData.get("title")?.toString();
  const text = formData.get("text")?.toString();

  if (!wikiId || !title || !text) {
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/pages/new`,
      "All fields are required"
    );
  }

  // Verify user owns the wiki
  const { data: wiki } = await supabase
    .from("wikis")
    .select("user_id")
    .eq("id", wikiId)
    .single();

  if (!wiki) {
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/pages/new`,
      "You don't have permission to create pages in this wiki"
    );
  }

  // Insert the page
  const { data: page, error } = await supabase
    .from("pages")
    .insert({
      wiki_id: wikiId,
      title,
      text,
      created_by: user.id,
      updated_by: user.id
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating page:", error);
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/pages/new`,
      "Failed to create page"
    );
  }

  // Track activity
  await trackActivity('create_page', 'page', page.id);

  return encodedRedirect(
    "success",
    `/wikis/${wikiId}/pages/${page.id}`,
    "Page created successfully"
  );
};

export const updatePageAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const wikiId = formData.get("wikiId")?.toString();
  const pageId = formData.get("pageId")?.toString();
  const title = formData.get("title")?.toString();
  const text = formData.get("text")?.toString();

  if (!wikiId || !pageId || !title || !text) {
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/pages/${pageId}/edit`,
      "All fields are required"
    );
  }

  // Verify user owns the wiki
  const { data: wiki } = await supabase
    .from("wikis")
    .select("user_id")
    .eq("id", wikiId)
    .single();

  if (!wiki || wiki.user_id !== user.id) {
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/pages/${pageId}/edit`,
      "You don't have permission to edit this page"
    );
  }

  // Update the page
  const { error } = await supabase
    .from("pages")
    .update({
      title,
      text,
      updated_by: user.id,
      updated_at: new Date().toISOString()
    })
    .eq("id", pageId)
    .eq("wiki_id", wikiId);

  if (error) {
    console.error("Error updating page:", error);
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/pages/${pageId}/edit`,
      "Failed to update page"
    );
  }

  // Track activity
  await trackActivity('edit_page', 'page', pageId);

  return encodedRedirect(
    "success",
    `/wikis/${wikiId}/pages/${pageId}`,
    "Page updated successfully"
  );
};

export const deleteWikiAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const wikiId = formData.get("wikiId")?.toString();

  if (!wikiId) {
    return encodedRedirect("error", "/wikis", "Wiki ID is required");
  }

  // Verify user owns the wiki and get wiki details
  const { data: wiki } = await supabase
    .from("wikis")
    .select("user_id, title")  // Added title to the select
    .eq("id", wikiId)
    .single();

  if (!wiki || wiki.user_id !== user.id) {
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}`,
      "You don't have permission to delete this wiki"
    );
  }

  // Track activity before deletion
  await trackActivity('delete_wiki', 'wiki', wikiId, { title: wiki.title });

  // Delete the wiki (pages will be cascade deleted)
  const { error } = await supabase
    .from("wikis")
    .delete()
    .eq("id", wikiId);

  if (error) {
    console.error("Error deleting wiki:", error);
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}`,
      "Failed to delete wiki"
    );
  }

  return encodedRedirect(
    "success",
    "/wikis",
    "Wiki deleted successfully"
  );
};

export const deletePageAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const wikiId = formData.get("wikiId")?.toString();
  const pageId = formData.get("pageId")?.toString();

  if (!wikiId || !pageId) {
    return encodedRedirect(
      "error", 
      `/wikis/${wikiId}`,
      "Wiki ID and Page ID are required"
    );
  }

  // Verify user owns the page
  const { data: page } = await supabase
    .from("pages")
    .select("created_by, title")
    .eq("id", pageId)
    .single();

  if (!page || page.created_by !== user.id) {
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/pages/${pageId}`,
      "You don't have permission to delete this page"
    );
  }

  // Track activity before deletion
  await trackActivity('delete_page', 'page', pageId, { title: page?.title });

  // Delete the page
  const { error } = await supabase
    .from("pages")
    .delete()
    .eq("id", pageId)
    .eq("wiki_id", wikiId);

  if (error) {
    console.error("Error deleting page:", error);
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/pages/${pageId}`,
      "Failed to delete page"
    );
  }

  return encodedRedirect(
    "success",
    `/wikis/${wikiId}`,
    "Page deleted successfully"
  );
};

export const updateWikiAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const description = formData.get("description")?.toString();
  const isPublic = formData.get("isPublic")?.toString() === "true";
  const tags = formData.get("tags")?.toString().split(",").filter(Boolean) || [];

  if (!id || !title) {
    return encodedRedirect("error", `/wikis/${id}/edit`, "Title is required");
  }

  // Check ownership
  const { data: wiki } = await supabase
    .from("wikis")
    .select("user_id")
    .eq("id", id)
    .single();

  if (!wiki || wiki.user_id !== user.id) {
    return encodedRedirect("error", "/wikis", "Unauthorized");
  }

  // Update wiki
  const { error: wikiError } = await supabase
    .from("wikis")
    .update({
      title,
      description,
      is_public: isPublic,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (wikiError) {
    return encodedRedirect("error", `/wikis/${id}/edit`, "Failed to update wiki");
  }

  // Handle tags
  // First, remove all existing tags
  await supabase
    .from("wiki_tags")
    .delete()
    .eq("wiki_id", id);

  if (tags.length > 0) {
    // Ensure all tags exist
    const { data: existingTags } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", tags);

    const existingTagNames = existingTags?.map(t => t.name) || [];
    const newTags = tags.filter(t => !existingTagNames.includes(t));

    // Create new tags
    if (newTags.length > 0) {
      await supabase
        .from("tags")
        .insert(newTags.map(name => ({
          name,
          user_id: user.id
        })));
    }

    // Get all tag IDs
    const { data: allTags } = await supabase
      .from("tags")
      .select("id, name")
      .in("name", tags);

    // Associate tags with wiki
    if (allTags) {
      await supabase
        .from("wiki_tags")
        .insert(allTags.map(tag => ({
          wiki_id: parseInt(id),
          tag_id: tag.id
        })));
    }
  }

  // Track activity
  await trackActivity(
    "update_wiki",
    "wiki",
    id,
    { title }
  );

  return redirect(`/wikis/${id}`);
};

export const shareWikiAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const wikiId = formData.get("wikiId")?.toString();
  const isPublic = formData.get("isPublic")?.toString() === "true";

  if (!wikiId || !isPublic) {
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/share`,
      "All fields are required"
    );
  }

  // Verify user owns the wiki
  const { data: wiki } = await supabase
    .from("wikis")
    .select("user_id")
    .eq("id", wikiId)
    .single();

  if (!wiki || wiki.user_id !== user.id) {
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/share`,
      "You don't have permission to share this wiki"
    );
  }

  // Track activity
  await trackActivity('share_wiki', 'wiki', wikiId, {
    is_public: isPublic
  });

  // ... rest of the function ...
};
