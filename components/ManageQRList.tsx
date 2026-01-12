'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SavedQRCode } from '@/lib/db/qr-repository';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, Eye, Edit } from 'lucide-react';

interface ManageQRListProps {
  initialQRCodes: SavedQRCode[];
}

export default function ManageQRList({ initialQRCodes }: ManageQRListProps) {
  const [qrCodes, setQRCodes] = useState(initialQRCodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_desc' | 'created_asc' | 'nickname' | 'views'>('created_desc');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNickname, setEditNickname] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [qrToDelete, setQrToDelete] = useState<number | null>(null);
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/qr/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setQRCodes(qrCodes.filter(qr => qr.id !== id));
        toast('QR Code Deleted', {
          description: 'Successfully removed from your collection.',
          style: {
            background: 'rgb(217, 245, 139)',
            border: '1px solid rgb(69, 68, 128)',
            color: 'rgb(69, 68, 128)',
          },
        });
        setDeleteDialogOpen(false);
        setQrToDelete(null);
      } else {
        toast('Error', {
          description: 'Failed to delete QR code.',
          style: {
            background: '#fee',
            border: '1px solid #c33',
            color: '#c33',
          },
        });
      }
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast('Error', {
        description: 'An unexpected error occurred.',
        style: {
          background: '#fee',
          border: '1px solid #c33',
          color: '#c33',
        },
      });
    }
  };

  const handleUpdateNickname = async (id: number) => {
    try {
      const response = await fetch(`/api/qr/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname: editNickname }),
      });

      const data = await response.json();

      if (response.ok) {
        setQRCodes(qrCodes.map(qr => qr.id === id ? data.data : qr));
        setEditingId(null);
        setEditNickname('');
        toast('Nickname Updated', {
          description: 'Successfully updated QR code nickname.',
          style: {
            background: 'rgb(217, 245, 139)',
            border: '1px solid rgb(69, 68, 128)',
            color: 'rgb(69, 68, 128)',
          },
        });
      } else {
        toast('Error', {
          description: data.error || 'Failed to update nickname.',
          style: {
            background: '#fee',
            border: '1px solid #c33',
            color: '#c33',
          },
        });
      }
    } catch (error) {
      console.error('Error updating nickname:', error);
      toast('Error', {
        description: 'An unexpected error occurred.',
        style: {
          background: '#fee',
          border: '1px solid #c33',
          color: '#c33',
        },
      });
    }
  };

  const handleViewQR = (encryptedPayload: string) => {
    router.push(`/share?data=${encodeURIComponent(encryptedPayload)}`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-NZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredAndSortedQRCodes = qrCodes
    .filter(qr => {
      if (!searchQuery) return true;
      const nickname = qr.nickname?.toLowerCase() || '';
      return nickname.includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created_desc':
          return b.created_at - a.created_at;
        case 'created_asc':
          return a.created_at - b.created_at;
        case 'nickname':
          return (a.nickname || '').localeCompare(b.nickname || '');
        case 'views':
          return b.view_count - a.view_count;
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by nickname..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_desc">Newest First</SelectItem>
              <SelectItem value="created_asc">Oldest First</SelectItem>
              <SelectItem value="nickname">Nickname (A-Z)</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* QR Code List */}
      {filteredAndSortedQRCodes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {searchQuery ? 'No QR codes match your search.' : 'No saved QR codes yet. Create one and save it!'}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredAndSortedQRCodes.map((qr) => (
            <Card key={qr.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingId === qr.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editNickname}
                        onChange={(e) => setEditNickname(e.target.value)}
                        placeholder="Enter nickname..."
                        className="flex-1"
                      />
                      <Button size="sm" onClick={() => handleUpdateNickname(qr.id)}>
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          setEditNickname('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="truncate">{qr.nickname || 'Untitled QR Code'}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingId(qr.id);
                          setEditNickname(qr.nickname || '');
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  Created: {formatDate(qr.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Views: {qr.view_count}
                  {qr.last_accessed && (
                    <> · Last accessed: {formatDate(qr.last_accessed)}</>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleViewQR(qr.encrypted_payload)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View QR
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setQrToDelete(qr.id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete QR Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this QR code? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => qrToDelete && handleDelete(qrToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
