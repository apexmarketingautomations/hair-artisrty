import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Star, Image, Video, Link2, Upload, Eye, ArrowLeft, Pencil, Check, X } from "lucide-react";
import { Link } from "wouter";
import type { GalleryItem } from "@shared/schema";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4 } }),
};

export default function AdminGallery() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    type: "image",
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    category: "general",
    featured: false,
    sortOrder: 0,
  });

  const { data: items, isLoading } = useQuery<GalleryItem[]>({
    queryKey: ["/api/gallery"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/gallery", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Content added", description: "New gallery item has been published." });
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add content.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<typeof formData> }) => {
      const res = await apiRequest("PATCH", `/api/gallery/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Updated", description: "Gallery item has been updated." });
      setEditingId(null);
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/gallery/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
      toast({ title: "Deleted", description: "Gallery item removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    },
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, featured }: { id: number; featured: boolean }) => {
      const res = await apiRequest("PATCH", `/api/gallery/${id}`, { featured: !featured });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery"] });
    },
  });

  function resetForm() {
    setFormData({ type: "image", title: "", description: "", url: "", thumbnail: "", category: "general", featured: false, sortOrder: 0 });
    setShowForm(false);
    setEditingId(null);
  }

  function startEdit(item: GalleryItem) {
    setFormData({
      type: item.type,
      title: item.title,
      description: item.description || "",
      url: item.url,
      thumbnail: item.thumbnail || "",
      category: item.category,
      featured: item.featured,
      sortOrder: item.sortOrder,
    });
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.url) {
      toast({ title: "Missing fields", description: "Title and URL are required.", variant: "destructive" });
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please use an image under 5MB, or paste an image URL instead.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({ ...prev, url: base64 }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/gallery">
              <Button variant="ghost" size="icon" data-testid="button-back-gallery">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-xl font-semibold" data-testid="text-admin-title">Content Manager</h1>
              <p className="text-muted-foreground text-xs">Add and manage gallery photos, videos, and links</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/leads">
              <Button variant="outline" size="sm" data-testid="button-go-leads">
                Prospect Leads
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" size="sm" data-testid="button-view-gallery">
                <Eye className="w-3.5 h-3.5 mr-1.5" /> View Gallery
              </Button>
            </Link>
            {!showForm && (
              <Button size="sm" onClick={() => setShowForm(true)} data-testid="button-add-content">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Content
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-lg">{editingId ? "Edit Content" : "Add New Content"}</h2>
                  <Button variant="ghost" size="icon" onClick={resetForm} data-testid="button-close-form">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Type</label>
                      <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                        <SelectTrigger data-testid="select-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">Photo</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="link">Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Category</label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="transformations">Transformations</SelectItem>
                          <SelectItem value="color">Color Work</SelectItem>
                          <SelectItem value="braids">Braids & Styles</SelectItem>
                          <SelectItem value="mens">Men's Grooming</SelectItem>
                          <SelectItem value="bridal">Bridal</SelectItem>
                          <SelectItem value="behind-the-scenes">Behind the Scenes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Sort Order</label>
                      <Input
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                        data-testid="input-sort-order"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Title</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Balayage Transformation"
                      data-testid="input-title"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Description (optional)</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief caption or description..."
                      className="resize-none min-h-[70px]"
                      data-testid="input-description"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      {formData.type === "image" ? "Image URL or Upload" : formData.type === "video" ? "Video URL (YouTube, Instagram, TikTok, or direct)" : "Link URL"}
                    </label>
                    {formData.type === "image" && (
                      <div className="flex gap-2 mb-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-dashed border-primary/40 bg-primary/5 text-primary text-sm cursor-pointer hover:bg-primary/10 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          Upload Image
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" data-testid="input-file-upload" />
                        </label>
                        <span className="text-xs text-muted-foreground self-center">or paste a URL below</span>
                      </div>
                    )}
                    <Input
                      value={formData.url.startsWith("data:") ? "(uploaded image)" : formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder={formData.type === "video" ? "https://youtube.com/watch?v=..." : formData.type === "link" ? "https://..." : "https://example.com/photo.jpg"}
                      disabled={formData.url.startsWith("data:")}
                      data-testid="input-url"
                    />
                    {formData.url.startsWith("data:") && (
                      <button type="button" onClick={() => setFormData({ ...formData, url: "" })} className="text-xs text-primary mt-1" data-testid="button-clear-upload">
                        Clear upload and enter URL instead
                      </button>
                    )}
                  </div>

                  {formData.type !== "image" && (
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Thumbnail URL (optional)</label>
                      <Input
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        placeholder="https://example.com/thumb.jpg"
                        data-testid="input-thumbnail"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="rounded"
                        data-testid="input-featured"
                      />
                      <span className="text-sm font-medium">Featured (shows larger in gallery)</span>
                    </label>
                  </div>

                  {formData.url && formData.type === "image" && (
                    <div className="border border-border rounded-lg overflow-hidden max-w-xs">
                      <img src={formData.url} alt="Preview" className="w-full h-40 object-cover" />
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-submit-content">
                      {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingId ? "Update Content" : "Publish Content"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel-form">
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg">
            {isLoading ? "Loading..." : `${items?.length || 0} items`}
          </h2>
        </div>

        {items && items.length === 0 && !showForm ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
            <Upload className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-serif text-lg mb-2">No Content Yet</h3>
            <p className="text-muted-foreground text-sm mb-4">Start building your gallery by adding photos, videos, and links.</p>
            <Button onClick={() => setShowForm(true)} data-testid="button-add-first">
              <Plus className="w-4 h-4 mr-1.5" /> Add Your First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {items?.map((item, i) => (
              <motion.div
                key={item.id}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={i}
                className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card hover-elevate"
                data-testid={`row-gallery-${item.id}`}
              >
                <div className="shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted">
                  {item.type === "image" ? (
                    <img src={item.thumbnail || item.url} alt={item.title} className="w-full h-full object-cover" />
                  ) : item.type === "video" ? (
                    item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-rose-500/20 flex items-center justify-center">
                        <Video className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-500/10 to-rose-500/10 flex items-center justify-center">
                      <Link2 className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                    {item.featured && <Badge variant="secondary" className="text-[10px] py-0 shrink-0">Featured</Badge>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] py-0">
                      {item.type === "image" ? "Photo" : item.type === "video" ? "Video" : "Link"}
                    </Badge>
                    <span>{item.category}</span>
                    {item.description && <span className="truncate max-w-[200px]">{item.description}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => toggleFeatured.mutate({ id: item.id, featured: item.featured })}
                    data-testid={`button-toggle-featured-${item.id}`}
                  >
                    <Star className={`w-3.5 h-3.5 ${item.featured ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => startEdit(item)}
                    data-testid={`button-edit-${item.id}`}
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => { if (confirm("Delete this item?")) deleteMutation.mutate(item.id); }}
                    data-testid={`button-delete-${item.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
