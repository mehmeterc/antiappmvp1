import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { FILTER_OPTIONS } from "../FilterOptions";
import { Loader2 } from "lucide-react";

export const AddCafeForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    rating: "",
    price: "€",
    occupancy: "Quiet",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to add a cafe",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = "";
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('cafe-images')
          .upload(fileName, selectedImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('cafe-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('cafes').insert({
        title: formData.title,
        description: formData.description,
        address: formData.address,
        rating: parseFloat(formData.rating),
        image_url: imageUrl,
        price: formData.price,
        occupancy: formData.occupancy,
        amenities: selectedAmenities,
        tags: [],
        lat: 0, // These would ideally come from geocoding the address
        lng: 0,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Cafe added successfully!",
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding cafe:', error);
      toast({
        title: "Error",
        description: "Failed to add cafe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Cafe Name</label>
        <Input
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter cafe name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea
          required
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the cafe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <Input
          required
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          placeholder="Enter cafe address"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Google Rating (0-5)</label>
        <Input
          required
          type="number"
          min="0"
          max="5"
          step="0.1"
          value={formData.rating}
          onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price Range</label>
        <select
          className="w-full rounded-md border border-input p-2"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}>
          <option value="€">€ (Budget)</option>
          <option value="€€">€€ (Moderate)</option>
          <option value="€€€">€€€ (Premium)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Typical Occupancy</label>
        <select
          className="w-full rounded-md border border-input p-2"
          value={formData.occupancy}
          onChange={(e) => setFormData(prev => ({ ...prev, occupancy: e.target.value }))}>
          <option value="Quiet">Quiet</option>
          <option value="Moderate">Moderate</option>
          <option value="Busy">Busy</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cafe Image</label>
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Amenities</label>
        <div className="grid grid-cols-2 gap-2">
          {FILTER_OPTIONS.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedAmenities.includes(option.id)}
                onCheckedChange={(checked) => {
                  setSelectedAmenities(prev =>
                    checked
                      ? [...prev, option.id]
                      : prev.filter(id => id !== option.id)
                  );
                }}
              />
              <label htmlFor={option.id} className="text-sm cursor-pointer">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding Cafe...
          </>
        ) : (
          'Add Cafe'
        )}
      </Button>
    </form>
  );
};