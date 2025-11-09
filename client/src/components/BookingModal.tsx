import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBookingSchema } from "@shared/schema";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = insertBookingSchema.extend({
  preferredDate: z.string().optional(),
  budget: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lawyerId: string;
  lawyerName: string;
}

export function BookingModal({
  open,
  onOpenChange,
  lawyerId,
  lawyerName,
}: BookingModalProps) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lawyerId,
      caseTitle: "",
      caseDescription: "",
      preferredDate: "",
      preferredTime: "",
      budget: "",
      contactPreference: "in-app",
      externalContactInfo: "",
    },
  });

  useEffect(() => {
    form.reset({
      lawyerId,
      caseTitle: "",
      caseDescription: "",
      preferredDate: "",
      preferredTime: "",
      budget: "",
      contactPreference: "in-app",
      externalContactInfo: "",
    });
  }, [lawyerId, form]);

  const createBookingMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await apiRequest("/api/bookings", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings/user"] });
      toast({
        title: "Booking Submitted",
        description: `Your consultation request has been sent to ${lawyerName}`,
      });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create booking. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createBookingMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Consultation with {lawyerName}</DialogTitle>
          <DialogDescription>
            Fill in the details below to request a consultation
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="caseTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Employment Contract Review"
                      {...field}
                      data-testid="input-case-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="caseDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your legal matter in detail..."
                      className="min-h-32"
                      {...field}
                      data-testid="input-case-description"
                    />
                  </FormControl>
                  <FormDescription>
                    Provide as much detail as possible to help the lawyer understand your case
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-preferred-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2:00 PM - 4:00 PM" {...field} data-testid="input-preferred-time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget (USD, Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Your budget for this consultation"
                      {...field}
                      data-testid="input-budget"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Contact Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-contact-preference">
                        <SelectValue placeholder="Select contact method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in-app">In-App Chat</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("contactPreference") !== "in-app" && (
              <FormField
                control={form.control}
                name="externalContactInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Contact Information</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={
                          form.watch("contactPreference") === "whatsapp"
                            ? "WhatsApp number"
                            : form.watch("contactPreference") === "email"
                            ? "Email address"
                            : "Phone number"
                        }
                        {...field}
                        data-testid="input-external-contact"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                data-testid="button-cancel-booking"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createBookingMutation.isPending}
                data-testid="button-submit-booking"
              >
                {createBookingMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
