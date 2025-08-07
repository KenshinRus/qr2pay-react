'use client';

import { useState } from "react";
import { generateAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import bankAccountValidator from "@fnzc/nz-bank-account-validator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Create() {
  const [headerTag, setHeaderTag] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [accountOwner, setAccountOwner] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (formData: FormData) => {
    if (!headerTag.trim() || !bankAccount.trim() || !accountOwner.trim()) {
      setModalMessage("Please fill in all fields.");
      setShowModal(true);
      return;
    }

    // Validate NZ bank account format and checksum
    const isValidBankAccount = validateNZBankAccount(bankAccount);
    if (!isValidBankAccount) {
      setModalMessage(
        "Invalid New Zealand bank account number. Please enter in the format XX-XXXX-XXXXXXX-XX or XX-XXXX-XXXXXXX-XXX."
      );
      setShowModal(true);
      return;
    }

    formData.set("headertag", headerTag);
    formData.set("bank_account", bankAccount);
    formData.set("account_owner", accountOwner);
    await generateAction(formData);
  };

  const validateNZBankAccount = (account: string): boolean => {
    const parts = account.replace(/\s/g, "").split("-");
    if (parts.length !== 4) return false;

    const [bank, branch, base, suffix] = parts;

    // Check lengths and digits
    if (
      bank.length !== 2 ||
      branch.length !== 4 ||
      base.length !== 7 ||
      (suffix.length !== 2 && suffix.length !== 3) ||
      !/^\d+$/.test(bank) ||
      !/^\d+$/.test(branch) ||
      !/^\d+$/.test(base) ||
      !/^\d+$/.test(suffix)
    ) {
      return false;
    }

    // Pad base to 8 digits and suffix to 3 digits
    const basePadded = base.padStart(8, "0");
    const suffixPadded = suffix.padStart(3, "0");

    // Use the validator library
    return bankAccountValidator.isValidNZBankNumber(
      bank,
      branch,
      basePadded,
      suffixPadded
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-background p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl">
        Create QR code to share account number and owner name
      </h2>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="headertag">Description:</Label>
          <Input
            id="headertag"
            value={headerTag}
            onChange={(e) => setHeaderTag(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="bank_account">Payment into the account:</Label>
          <Input
            id="bank_account"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            required
            placeholder="e.g., 02-1234-5678901-00"
          />
        </div>
        <div>
          <Label htmlFor="account_owner">Account owner:</Label>
          <Input
            id="account_owner"
            value={accountOwner}
            onChange={(e) => setAccountOwner(e.target.value)}
            required
          />
        </div>   
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validation Error</DialogTitle>
          </DialogHeader>
          <DialogDescription>{modalMessage}</DialogDescription>
          <DialogFooter>
            <Button onClick={() => setShowModal(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
