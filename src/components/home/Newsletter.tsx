"use client";

import { useState } from "react";
import { Award, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation, gql } from "@apollo/client";

const CREATE_SUBSCRIBER = gql`
  mutation CreateSubscriber($input: SubscribeInput!) {
    createSubscriber(input: $input) {
      email
    }
  }
`;

interface NewsletterProps {
    title?: string;
    description?: string;
}

export default function Newsletter({ title, description }: NewsletterProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    const [createSubscriber] = useMutation(CREATE_SUBSCRIBER);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus("loading");
        try {
            await createSubscriber({
                variables: {
                    input: { email },
                },
            });

            setStatus("success");
            setMessage("Thank you for subscribing!");
            setEmail("");
        } catch (error: any) {
            console.error("Subscription error:", error);
            setStatus("error");
            setMessage(error.message || "Something went wrong. Please try again.");
        } finally {
            setTimeout(() => {
                if (status === "success" || status === "error") {
                    setStatus(prev => prev === "success" ? "idle" : prev);
                }
            }, 3000);
        }
    };

    return (
        <section className="py-24 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex items-center justify-center mb-6">
                    <Award className="w-8 h-8 text-primary mx-3" />
                    <h2 className="font-cormorant text-display-sm font-bold text-foreground">
                        {title || "Stay Updated with MiskBlooming"}
                    </h2>
                    <Award className="w-8 h-8 text-primary mx-3" />
                </div>
                <p className="text-muted-foreground text-xl mb-8 max-w-2xl mx-auto">
                    {description ||
                        "Subscribe to our newsletter for the latest in luxury floral designs, exclusive offers, and more."}
                </p>

                {status === "success" ? (
                    <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
                        {message}
                    </div>
                ) : (
                    <form
                        className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                        onSubmit={handleSubmit}
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-6 py-4 rounded-xl border border-border  
              focus:ring-2 focus:ring-ring transition-all bg-background"
                            required
                            disabled={status === "loading"}
                        />
                        <Button
                            variant="luxury"
                            size="lg"
                            type="submit"
                            className="hover:text-secondary min-w-[140px]"
                            disabled={status === "loading"}
                        >
                            {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Subscribe"}
                        </Button>
                    </form>
                )}
                {status === "error" && <p className="mt-2 text-red-500">{message}</p>}
            </div>
        </section>
    );
}
