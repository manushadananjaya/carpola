"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Navbar } from "@/components/Navbar";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Footer } from "@/components/Footer";
import vehicleBrands from "../../data/vehicle_brands.json";
import motoBrands from "../../data/moto_brands.json";
import LoadingMessage from "@/components/ui/loading-massage";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const validateImage = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File is larger than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'File type not supported'
    };
  }
  return { valid: true };
};

const GearType = {
  AUTOMATIC: "AUTOMATIC",
  MANUAL: "MANUAL",
  SEMI_AUTOMATIC: "SEMI_AUTOMATIC",
} as const;

const FuelType = {
  PETROL: "PETROL",
  DIESEL: "DIESEL",
  ELECTRIC: "ELECTRIC",
  HYBRID: "HYBRID",
} as const;

const StartType = {
  ELECTRIC: "ELECTRIC",
  KICK: "KICK",
} as const;

const BikeType = {
  FUEL: "FUEL",
  ELECTRIC: "ELECTRIC",
} as const;

const VehicleType = {
  CAR: "CAR",
  VAN: "VAN",
  JEEP: "JEEP",
  LORRY: "LORRY",
  BIKE: "BIKE",
  CREWCAB: "CREWCAB",
  PICKUP: "PICKUP",
  BUS: "BUS",
  TRUCK: "TRUCK",
  THREEWHEEL: "THREEWHEEL",
  TRACTOR: "TRACTOR",
  HEAVYDUTY: "HEAVYDUTY",
  OTHER: "OTHER",
} as const;

const formSchema = z
  .object({
    type: z.nativeEnum(VehicleType, {
      required_error: "You must select a type.",
    }),
    userId: z.string().nonempty(),
    brand: z.string().min(2, {
      message: "Brand must be at least 2 characters.",
    }),
    model: z.string().min(2, {
      message: "Model must be at least 2 characters.",
    }),
    year: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 1),
    price: z.number().positive({
      message: "Price must be a positive number.",
    }),
    mileage: z.number().nonnegative({
      message: "Mileage must be a non-negative number.",
    }),
    engineCC: z
      .number()
      .positive({
        message: "Engine CC must be a positive number.",
      })
      .optional(),
    gearType: z.nativeEnum(GearType).optional(),
    fuelType: z.nativeEnum(FuelType).optional(),
    startType: z.nativeEnum(StartType).optional(),
    bikeType: z.nativeEnum(BikeType).optional(),
    details: z.string().min(10, {
      message: "Details must be at least 10 characters.",
    }),
    contactNo: z.string().min(10, {
      message: "Please enter a valid phone number.",
    }),
    city: z.string().nonempty({
      message: "City is required.",
    }),
    district: z.string().nonempty({
      message: "District is required.",
    }),
    images: z
      .array(z.any())
      .refine((files) => files.length >= 1, "At least one image is required")
      .refine((files) => files.length <= 5, "You can upload a maximum of 5 images"),
  })
  .refine(
    (data) => {
      if (data.type === "BIKE") {
        return data.startType && data.bikeType && data.engineCC;
      }
      return true;
    },
    {
      message: "For bikes, start type, bike type, and engine are required.",
      path: ["startType", "bikeType", "engineCC"],
    }
  );

export default function AdPostingForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);
  const [brandOptions, setBrandOptions] = useState<
    { id: number; name: string }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: undefined,
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      engineCC: 0,
      gearType: GearType.MANUAL,
      fuelType: FuelType.PETROL,
      startType: StartType.ELECTRIC,
      bikeType: BikeType.FUEL,
      details: "",
      contactNo: "",
      city: "",
      district: "",
      images: [],
      userId: "",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (session?.user) {
      const { userPhone, city, district } = session.user;
      
      if (!userPhone || !city || !district) {
        setAlertInfo({
          type: "warning",
          message: "Please complete your profile to post a free ad. If you have already completed your profile, please refresh this page.",
        });
        setTimeout(() => router.push("/user"), 3000);
      } else {
        form.setValue("contactNo", userPhone);
        form.setValue("city", city);
        form.setValue("district", district);
        form.setValue("userId", String(session.user.id) || "");
      }
    }
  }, [status, session, router, form]);

  const watchType = form.watch("type");

  useEffect(() => {
    setBrandOptions(
      watchType === "BIKE" ? motoBrands.data : vehicleBrands.data
    );
  }, [watchType]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof window === "undefined") return;
    
    const files = Array.from(event.target.files || []);
    const currentImages = form.getValues("images");
    const newImages = files.slice(0, 5 - currentImages.length);

    const validImages = newImages.filter(file => {
      const validation = validateImage(file);
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (validImages.length > 0) {
      const updatedImages = [...currentImages, ...validImages];
      form.setValue("images", updatedImages);

      const newPreviews = validImages.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }

    if (currentImages.length + validImages.length >= 5) {
      toast({
        title: "Maximum images reached",
        description: "You can upload a maximum of 5 images.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = form.getValues("images");
    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", updatedImages);

    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setAlertInfo(null);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing.");
      }

      // Upload images to Cloudinary
      const uploadedImageUrls = await Promise.all(
        values.images.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Failed to upload image to Cloudinary");
          }

          const data = await response.json();
          return data.secure_url;
        })
      );

      const submissionData = {
        ...values,
        images: uploadedImageUrls,
      };

      const apiResponse = await fetch("/api/post-ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to submit ad data");
      }

      setAlertInfo({
        type: "success",
        message: "Your ad has been submitted for review.",
      });

      setTimeout(() => router.push("/my-ads"), 3000);
    } catch (error) {
      console.error("Error posting ad:", error);
      setAlertInfo({
        type: "error",
        message: "There was a problem posting your ad. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "loading") {
    return <div><LoadingMessage /></div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Post Your Ad</h1>
        {alertInfo && (
          <Alert
            variant={alertInfo.type === "success" ? "default" : alertInfo.type === "warning" ? "default" : "destructive"}
            className="mb-6"
          >
            <AlertTitle>
              {alertInfo.type === "success" ? "Success" : alertInfo.type === "warning" ? "Warning" : "Error"}
            </AlertTitle>
            <AlertDescription>{alertInfo.message}</AlertDescription>
          </Alert>
        )}
        {!alertInfo && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 bg-white p-6 rounded-lg shadow"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(VehicleType).map(([key, value]) => (
                          <SelectItem key={key} value={value}>
                            {key.charAt(0) + key.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brandOptions.map((brand) => (
                          <SelectItem key={brand.id} value={brand.name}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter model" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchType !== "BIKE" && (
                <>
                  <FormField
                    control={form.control}
                    name="engineCC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine CC</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gearType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gear Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gear type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(GearType).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fuelType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(FuelType).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {watchType === "BIKE" && (
                <>
                  <FormField
                    control={form.control}
                    name="engineCC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine CC</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select start type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(StartType).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bikeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bike Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bike type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(BikeType).map(([key, value]) => (
                              <SelectItem key={key} value={value}>
                                {key.charAt(0) + key.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter details about your vehicle or bike"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much information as possible to attract potential buyers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your contact number"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormDescription>
                      If you want to change contact number go to your profile settings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your city" {...field} disabled />
                    </FormControl>
                    <FormDescription>
                      If you want to change your city, go to your profile settings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your district"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormDescription>
                      If you want to change your district, go to your profile settings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images (Max 5)</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                          {previewImages.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="w-32 h-32 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label={`Remove image ${index + 1}`}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        {field.value.length < 5 && (
                          <Input
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            onChange={handleImageUpload}
                            multiple
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload up to 5 images of your vehicle or bike. Accepted formats: JPG, PNG, WebP. Max size: 5MB per image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Ad"}
              </Button>
            </form>
          </Form>
        )}
      </main>
      <Footer />
    </div>
  );
}
