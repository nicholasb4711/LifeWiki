"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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

  if (!title) {
    return encodedRedirect("error", "/wikis/new", "Title is required");
  }

  // insert wiki into database
  const { data: wiki, error } = await supabase.from("wikis").insert({
    title,
    description,
    is_public: isPublic,
    user_id: user.id,
  }).select().single();

  if (error) {
    console.error('error creating wiki', error);
    return encodedRedirect("error", "/wikis/new", "Failed to create wiki");
  }

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

  if (!wiki || wiki.user_id !== user.id) {
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

  // Verify user owns the wiki
  const { data: wiki } = await supabase
    .from("wikis")
    .select("user_id")
    .eq("id", wikiId)
    .single();

  if (!wiki || wiki.user_id !== user.id) {
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}`,
      "You don't have permission to delete this wiki"
    );
  }

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

  // Verify user owns the wiki
  const { data: wiki } = await supabase
    .from("wikis")
    .select("user_id")
    .eq("id", wikiId)
    .single();

  if (!wiki || wiki.user_id !== user.id) {
    return encodedRedirect(
      "error",
      `/wikis/${wikiId}/pages/${pageId}`,
      "You don't have permission to delete this page"
    );
  }

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
