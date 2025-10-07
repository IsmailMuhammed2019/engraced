"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal, AlertModal } from "@/components/ui/modal";
import { 
  Plus,
  Search, 
  Edit, 
  Trash2, 
  Gift,
  Percent,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from "lucide-react";

interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string | null;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_RIDE";
  value: number;
  minAmount: number | null;
  maxDiscount: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit: number | null;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertModal, setAlertModal] = useState<{show: boolean; title: string; message: string; type: 'success' | 'error' | 'info'}>({
    show: false,
    title: '',
    message: '',
    type: 'info'
  });
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    type: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_RIDE',
    value: '',
    minAmount: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    maxUsage: '',
    status: 'active'
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/promotions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      } else {
        setPromotions([]);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setPromotions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromotion = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/promotions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setPromotions(prev => [...prev, data]);
        setShowAddModal(false);
        resetForm();
        showAlert('Success', 'Promotion created successfully!', 'success');
      } else {
        const errorData = await response.json();
        showAlert('Error', `Failed to create promotion: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error adding promotion:', error);
      showAlert('Error', 'Failed to add promotion', 'error');
    }
  };

  const handleEditPromotion = async () => {
    if (!selectedPromotion) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3003/api/v1/promotions/${selectedPromotion.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setPromotions(prev => prev.map(p => p.id === selectedPromotion.id ? data : p));
        setShowEditModal(false);
        setSelectedPromotion(null);
        resetForm();
        showAlert('Success', 'Promotion updated successfully!', 'success');
      } else {
        const errorData = await response.json();
        showAlert('Error', `Failed to update promotion: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error updating promotion:', error);
      showAlert('Error', 'Failed to update promotion', 'error');
    }
  };

  const handleDeletePromotion = async (promotion: Promotion) => {
    if (confirm(`Are you sure you want to delete "${promotion.title}"?`)) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:3003/api/v1/promotions/${promotion.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setPromotions(prev => prev.filter(p => p.id !== promotion.id));
          showAlert('Success', 'Promotion deleted successfully!', 'success');
        } else {
          showAlert('Error', 'Failed to delete promotion', 'error');
        }
      } catch (error) {
        console.error('Error deleting promotion:', error);
        showAlert('Error', 'Failed to delete promotion', 'error');
      }
    }
  };

  const openEditModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      name: promotion.title,
      description: promotion.description,
      code: promotion.code || '',
      type: promotion.type,
      value: promotion.value.toString(),
      minAmount: promotion.minAmount?.toString() || '',
      maxDiscount: promotion.maxDiscount?.toString() || '',
      startDate: promotion.startDate.split('T')[0],
      endDate: promotion.endDate.split('T')[0],
      maxUsage: promotion.usageLimit?.toString() || '',
      status: promotion.isActive ? 'active' : 'inactive'
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      code: '',
      type: 'PERCENTAGE',
      value: '',
      minAmount: '',
      maxDiscount: '',
      startDate: '',
      endDate: '',
      maxUsage: '',
      status: 'active'
    });
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    setAlertModal({ show: true, title, message, type });
  };

  const getPromotionStatus = (promotion: Promotion): string => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) return "inactive";
    if (endDate < now) return "expired";
    if (startDate > now) return "scheduled";
    return "active";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Scheduled</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PERCENTAGE":
        return <Percent className="h-4 w-4" />;
      case "FIXED_AMOUNT":
        return <DollarSign className="h-4 w-4" />;
      case "FREE_RIDE":
        return <Gift className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const filteredPromotions = promotions.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.code && p.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: promotions.length,
    active: promotions.filter(p => getPromotionStatus(p) === "active").length,
    scheduled: promotions.filter(p => getPromotionStatus(p) === "scheduled").length,
    expired: promotions.filter(p => getPromotionStatus(p) === "expired").length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usedCount, 0)
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-end items-center">
          <Button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#5d4a15] hover:bg-[#6b5618]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Promotions</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Gift className="h-8 w-8 text-[#5d4a15]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expired</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Usage</p>
                  <p className="text-2xl font-bold text-[#5d4a15]">{stats.totalUsage}</p>
                </div>
                <Users className="h-8 w-8 text-[#5d4a15]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Promotions</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search promotions..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading promotions...</div>
            ) : filteredPromotions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No promotions found. Create your first promotion to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPromotions.map((promotion) => (
                  <Card key={promotion.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getTypeIcon(promotion.type)}
                            <h3 className="text-lg font-semibold">{promotion.title}</h3>
                            {getStatusBadge(getPromotionStatus(promotion))}
                            {promotion.code && (
                              <Badge className="bg-[#5d4a15] text-white">
                                CODE: {promotion.code}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{promotion.description}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Value</p>
                              <p className="font-medium">
                                {promotion.type === 'PERCENTAGE' ? `${promotion.value}%` : `₦${promotion.value}`}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Usage</p>
                              <p className="font-medium">
                                {promotion.usedCount} / {promotion.usageLimit || '∞'}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Start Date</p>
                              <p className="font-medium">
                                {new Date(promotion.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">End Date</p>
                              <p className="font-medium">
                                {new Date(promotion.endDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(promotion)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePromotion(promotion)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Promotion Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            resetForm();
          }}
          title="Create New Promotion"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Promotion Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Summer Sale"
                />
              </div>
              <div>
                <Label htmlFor="code">Promo Code (optional)</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g., SUMMER2024"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the promotion..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage Discount</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                    <SelectItem value="FREE_RIDE">Free Ride</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">Value *</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={formData.type === 'PERCENTAGE' ? "e.g., 10" : "e.g., 500"}
                />
              </div>
              <div>
                <Label htmlFor="maxUsage">Usage Limit</Label>
                <Input
                  id="maxUsage"
                  type="number"
                  value={formData.maxUsage}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUsage: e.target.value }))}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minAmount">Min Amount (₦)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, minAmount: e.target.value }))}
                  placeholder="Minimum booking amount"
                />
              </div>
              <div>
                <Label htmlFor="maxDiscount">Max Discount (₦)</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                  placeholder="Maximum discount amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPromotion}
                className="bg-[#5d4a15] hover:bg-[#6b5618]"
              >
                Create Promotion
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Promotion Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPromotion(null);
            resetForm();
          }}
          title="Edit Promotion"
          size="lg"
        >
          {/* Same form fields as Add Modal */}
          <div className="space-y-4">
            {/* Copy the same form structure from Add Modal */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Promotion Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Summer Sale"
                />
              </div>
              <div>
                <Label htmlFor="edit-code">Promo Code (optional)</Label>
                <Input
                  id="edit-code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="e.g., SUMMER2024"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the promotion..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-type">Type *</Label>
                <Select 
                  value={formData.type}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage Discount</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                    <SelectItem value="FREE_RIDE">Free Ride</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-value">Value *</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={formData.type === 'PERCENTAGE' ? "e.g., 10" : "e.g., 500"}
                />
              </div>
              <div>
                <Label htmlFor="edit-maxUsage">Usage Limit</Label>
                <Input
                  id="edit-maxUsage"
                  type="number"
                  value={formData.maxUsage}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxUsage: e.target.value }))}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startDate">Start Date *</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">End Date *</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedPromotion(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditPromotion}
                className="bg-[#5d4a15] hover:bg-[#6b5618]"
              >
                Update Promotion
              </Button>
            </div>
          </div>
        </Modal>

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.show}
          onClose={() => setAlertModal({...alertModal, show: false})}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      </div>
    </AdminLayout>
  );
}

