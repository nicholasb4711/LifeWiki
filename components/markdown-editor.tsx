"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Markdown } from "@/components/markdown"
import { cn } from "@/lib/utils"

interface MarkdownEditorProps {
  name: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  preview?: boolean;
}

export function MarkdownEditor({
  className,
  value,
  defaultValue = "",
  onChange,
  preview = true,
  name,
  ...props
}: MarkdownEditorProps) {
  const [content, setContent] = useState(value || defaultValue)
  const [activeTab, setActiveTab] = useState<string>("edit")

  useEffect(() => {
    if (value !== undefined) {
      setContent(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setContent(newValue)
    onChange?.(e)
  }

  return (
    <Tabs
      defaultValue="edit"
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          {preview && <TabsTrigger value="preview">Preview</TabsTrigger>}
          {preview && <TabsTrigger value="split">Split View</TabsTrigger>}
        </TabsList>
        <div className="text-sm text-muted-foreground">
          Supports markdown formatting
        </div>
      </div>

      <div className={cn(
        "rounded-md border",
        activeTab === "split" && "grid grid-cols-2 gap-4 p-0"
      )}>
        {activeTab === "split" ? (
          <>
            <div className="p-0">
              <Textarea
                name={name}
                value={content}
                onChange={handleChange}
                className={cn("min-h-[500px] rounded-none border-0 focus-visible:ring-0", className)}
                {...props}
              />
            </div>
            <div className="border-l p-4">
              <div className="prose dark:prose-invert max-w-none min-h-[500px]">
                <Markdown content={content || ""} />
              </div>
            </div>
          </>
        ) : (
          <>
            <TabsContent value="edit">
              <Textarea
                name={name}
                value={content}
                onChange={handleChange}
                className={cn("min-h-[500px] border-0 focus-visible:ring-0", className)}
                {...props}
              />
            </TabsContent>

            {preview && (
              <TabsContent value="preview" className="p-4">
                <div className="prose dark:prose-invert max-w-none min-h-[500px]">
                  <Markdown content={content || ""} />
                </div>
              </TabsContent>
            )}
          </>
        )}
      </div>
    </Tabs>
  )
} 