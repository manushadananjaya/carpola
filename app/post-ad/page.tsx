"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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


const formSchema = z
  .object({
    type: z.enum(["vehicle", "bike"], {
      required_error: "You must select a type.",
    }),
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
    engine: z
      .string()
      .min(2, {
        message: "Engine must be at least 2 characters.",
      })
      .optional(),
    details: z.string().min(10, {
      message: "Details must be at least 10 characters.",
    }),
    contactNo: z.string().regex(/^\+?[1-9]\d{1,14}$/, {
      message: "Please enter a valid phone number.",
    }),
    images: z
      .array(
        z
          .any()
          .refine((file) => file instanceof File, "Expected a File")
          .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
          .refine(
            (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
            ".jpg, .png and .webp files are accepted."
          )
      )
      .min(1, "At least one image is required")
      .max(5, "You can upload a maximum of 5 images"),
  })
  .refine(
    (data) => {
      if (data.type === "bike") {
        return data.startType && data.bikeType && data.engine;
      }
      return true;
    },
    {
      message: "For bikes, start type, bike type, and engine are required.",
      path: ["startType", "bikeType", "engine"],
    }
  );


export default function PostAdPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "vehicle",
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
      engine: "",
      details: "",
      contactNo: "",
      images: [],
    },
  });


  const watchType = form.watch("type");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your backend
      // For now, we'll just simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log(values);
      toast({
        title: "Ad Posted Successfully!",
        description: "Your ad has been submitted for review.",
      });
      router.push("/"); // Redirect to home page after successful submission
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem posting your ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    form.setValue("images", files);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Post Your Ad</h1>
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
                      <SelectItem value="vehicle">Vehicle</SelectItem>
                      <SelectItem value="bike">Bike</SelectItem>
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
                  <FormControl>
                    <Input placeholder="Enter brand" {...field} />
                  </FormControl>
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
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
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
            {watchType === "vehicle" && (
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
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
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
            {watchType === "bike" && (
              <>
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
                <FormField
                  control={form.control}
                  name="engine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engine</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter engine details" {...field} />
                      </FormControl>
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
                    Provide as much information as possible to attract potential
                    buyers.
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
                    <Input placeholder="Enter your contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      multiple
                      onChange={handleImageChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload up to 5 images (max 5MB each, .jpg, .png, or .webp)
                  </FormDescription>
                  <FormMessage />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {imagePreviews.map((preview, index) => (
                      <Image
                        key={index}
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        className="object-cover rounded"
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Ad"}
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
}
