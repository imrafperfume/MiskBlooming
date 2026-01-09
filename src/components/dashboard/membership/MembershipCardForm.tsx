"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { useEffect } from "react";

const MEMBERSHIP_TYPES = ["Mmbebr", "VIP", "PREMIUM", "GOLD", "PLATINUM"] as const;

const formSchema = z.object({
  cardNumber: z.string().min(4, "Card code must be at least 4 characters"),
  cardHolderName: z.string().min(2, "Name is required"),
  expirationDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "Expiration date must be in the future",
  }),
  membershipType: z.enum(MEMBERSHIP_TYPES),
  email: z.string().email("Invalid email address"),
});

const CREATE_CARD = gql`
  mutation CreateMembershipCard($input: CreateMembershipCardInput!) {
    createMembershipCard(input: $input) {
      id
      cardNumber
    }
  }
`;

const UPDATE_CARD = gql`
  mutation UpdateMembershipCard($input: UpdateMembershipCardInput!) {
    updateMembershipCard(input: $input) {
      id
      cardNumber
    }
  }
`;

interface MembershipCardFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function MembershipCardForm({ initialData, onSuccess }: MembershipCardFormProps) {
  const [createCard, { loading: creating }] = useMutation(CREATE_CARD);
  const [updateCard, { loading: updating }] = useMutation(UPDATE_CARD);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardHolderName: "",
      expirationDate: "",
      membershipType: "Mmbebr",
      email: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        cardNumber: initialData.cardNumber,
        cardHolderName: initialData.cardHolderName,
        expirationDate: new Date(initialData.expirationDate).toISOString().split("T")[0],
        membershipType: initialData.membershipType,
        email: initialData.user?.email || "",
      });
    }
  }, [initialData, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (initialData) {
        await updateCard({
          variables: {
            input: {
              id: initialData.id,
              ...values,
            },
          },
        });
        toast.success("Membership card updated successfully");
      } else {
        await createCard({
          variables: {
            input: values,
          },
        });
        toast.success("Membership card created successfully");
      }
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Email</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} disabled={!!initialData} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input placeholder="XXXX XXXX XXXX XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardHolderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expirationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiration Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="membershipType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membership Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MEMBERSHIP_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={creating || updating}>
          {initialData ? "Update Card" : "Create Card"}
        </Button>
      </form>
    </Form>
  );
}
