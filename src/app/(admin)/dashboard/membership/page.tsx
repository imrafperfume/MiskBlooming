"use client";

import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Plus, Pencil, Trash2, CreditCard, Loader2, Download, Mail } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { MembershipCardForm } from "@/src/components/dashboard/membership/MembershipCardForm";
import MembershipCard from "@/src/components/dashboard/membership/MembershipCard";
import { format } from "date-fns";
import { toast } from "sonner";
import html2canvas from "html2canvas";

const GET_CARDS = gql`
  query GetMembershipCards {
    membershipCards {
      id
      cardNumber
      cardHolderName
      expirationDate
      membershipType
      userId
      user {
        email
        firstName
        lastName
      }
    }
  }
`;

const DELETE_CARD = gql`
  mutation DeleteMembershipCard($id: ID!) {
    deleteMembershipCard(id: $id) {
      id
    }
  }
`;

const SEND_EMAIL = gql`
  mutation SendMembershipCard($id: ID!) {
    sendMembershipCard(id: $id)
  }
`;

// ... existing code ...

export default function MembershipPage() {
  const { data, loading, error, refetch } = useQuery(GET_CARDS, {
      fetchPolicy: "network-only"
  });
  const [deleteCard] = useMutation(DELETE_CARD);
  const [sendEmail, { loading: sendingEmail }] = useMutation(SEND_EMAIL);
  
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this membership card?")) {
      try {
        await deleteCard({ variables: { id } });
        toast.success("Membership card deleted");
        refetch();
      } catch (err) {
        toast.error("Failed to delete card");
      }
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById("membership-card-download");
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById("membership-card-download");
            if (clonedElement) {
                clonedElement.style.opacity = "1";
                // Ensure it's separate from other layers in the clone
                clonedElement.style.zIndex = "2147483647"; 
            }
        }
      });
      
      const link = document.createElement("a");
      link.download = `membership-${selectedCard.cardNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Card downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download card");
    }
  };

  const handleEmail = async () => {
    if (!selectedCard) return;
    try {
        await sendEmail({ variables: { id: selectedCard.id } });
        toast.success(`Email sent to ${selectedCard.user?.email || "user"}`);
    } catch (err: any) {
        toast.error(err.message || "Failed to send email");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-8 space-y-6">
       {/* ... Header and Table ... */}
       
       {/* (Table content omitted for brevity, keeping same) */}
       <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Membership Cards</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedCard(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedCard ? "Edit Card" : "New Membership Card"}</DialogTitle>
            </DialogHeader>
            <MembershipCardForm
              initialData={selectedCard}
              onSuccess={() => {
                setIsFormOpen(false);
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Card Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.membershipCards?.map((card: any) => (
              <TableRow key={card.id}>
                <TableCell>
                  <div className="font-medium">{card.cardHolderName}</div>
                  <div className="text-sm text-muted-foreground">{card.user?.email || card.userId}</div>
                </TableCell>
                <TableCell className="font-mono">{card.cardNumber}</TableCell>
                <TableCell>{card.membershipType}</TableCell>
                <TableCell>{format(new Date(card.expirationDate), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right space-x-2">
                   <Button variant="ghost" size="icon" onClick={() => {
                       setSelectedCard(card);
                       setIsPreviewOpen(true);
                   }}>
                    <CreditCard className="h-4 w-4" />
                   </Button>
                  <Button variant="ghost" size="icon" onClick={() => {
                      setSelectedCard(card);
                      setIsFormOpen(true);
                  }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(card.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data?.membershipCards?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No membership cards found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl bg-transparent border-none shadow-none p-0 flex flex-col items-center gap-4">
             <DialogTitle className="sr-only">Membership Card Preview</DialogTitle>
             {selectedCard && (
                 <>
                    <div id="membership-card-preview" className="p-4 rounded-xl">
                         <MembershipCard
                            cardNumber={selectedCard.cardNumber}
                            cardHolderName={selectedCard.cardHolderName}
                            expirationDate={selectedCard.expirationDate}
                            membershipType={selectedCard.membershipType}
                         />
                    </div>
                    
                    <div className="flex gap-4 bg-background/80 backdrop-blur p-4 rounded-lg shadow-lg">
                         <Button onClick={handleDownload} variant="outline" className="gap-2">
                             <Download className="w-4 h-4" /> Download
                         </Button>
                         <Button onClick={handleEmail} disabled={sendingEmail} className="gap-2">
                             {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                             Email to User
                         </Button>
                    </div>
                 </>
             )}
        </DialogContent>
      </Dialog>
      
      {/* Hidden element for capture - Opacity 0 to hide from user, onclone makes it Opacity 1 for capture */}
      {selectedCard && (
        <div 
            id="membership-card-download"
            style={{ 
                position: "fixed", 
                left: 0, 
                top: 0, 
                width: "400px", 
                height: "250px", 
                zIndex: -50,
                opacity: 0,
                pointerEvents: "none"
            }}
        >
        <MembershipCard
                cardNumber={selectedCard.cardNumber}
                cardHolderName={selectedCard.cardHolderName}
                expirationDate={selectedCard.expirationDate}
                membershipType={selectedCard.membershipType}
                variant="front"
            />
        </div>
      )}
    </div>
  );
}
