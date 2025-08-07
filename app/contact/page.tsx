// app/contact/page.tsx (Update to use server action if desired, but for simplicity, keep api or change similarly)
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add reCAPTCHA logic here if needed
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      setSuccess(true);
    } else {
      setError('Something went wrong.');
    }
  };

  if (success) {
    return <div className="text-center text-green-600">Message sent!</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-background p-6 rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold">Message me</h1>
      {error && <p className="text-destructive">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Your Name:</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="email">Email Address:</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="message">Message:</Label>
          <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        {/* Add reCAPTCHA component here */}
        <Button type="submit" className="w-full">Submit</Button>
      </form>
    </div>
  );
}