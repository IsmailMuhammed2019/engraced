"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal, AlertModal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Users,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  MoreVertical
} from "lucide-react";

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminStats {
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  superAdmins: number;
  regularAdmins: number;
}

export default function AdminsManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [newAdmin, setNewAdmin] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "ADMIN" as "ADMIN" | "SUPER_ADMIN"
  });

  const [editAdmin, setEditAdmin] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "ADMIN" as "ADMIN" | "SUPER_ADMIN",
    isActive: true
  });

  const [passwordUpdate, setPasswordUpdate] = useState({
    password: "",
    confirmPassword: ""
  });

  const [alertModal, setAlertModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    show: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    setAlertModal({ show: true, title, message, type });
  };

  useEffect(() => {
    fetchAdmins();
    fetchStats();
    checkCurrentUserRole();
  }, []);

  const checkCurrentUserRole = () => {
    // Get current admin info from token/storage
    const token = localStorage.getItem('adminToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserRole(payload.role || 'ADMIN');
      } catch (error) {
        setCurrentUserRole('ADMIN');
      }
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/admins', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      } else {
        showAlert('Error', 'Failed to fetch admins', 'error');
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      showAlert('Error', 'Failed to fetch admins', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/admins/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.email || !newAdmin.password || !newAdmin.firstName || !newAdmin.lastName) {
      showAlert('Error', 'Please fill in all fields', 'error');
      return;
    }

    if (newAdmin.password.length < 6) {
      showAlert('Error', 'Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/admins', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAdmin)
      });
      
      if (response.ok) {
        const addedAdmin = await response.json();
        setAdmins(prev => [addedAdmin, ...prev]);
        setShowAddModal(false);
        setNewAdmin({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          role: "ADMIN"
        });
        showAlert('Success', 'Admin created successfully!', 'success');
        fetchStats();
      } else {
        const errorData = await response.json();
        showAlert('Error', errorData.message || 'Failed to create admin', 'error');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      showAlert('Error', 'Failed to create admin', 'error');
    }
  };

  const handleEditAdmin = async () => {
    if (!editingAdmin) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3003/api/v1/admins/${editingAdmin.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editAdmin)
      });
      
      if (response.ok) {
        const updatedAdmin = await response.json();
        setAdmins(prev => prev.map(admin => 
          admin.id === editingAdmin.id ? updatedAdmin : admin
        ));
        setShowEditModal(false);
        setEditingAdmin(null);
        showAlert('Success', 'Admin updated successfully!', 'success');
        fetchStats();
      } else {
        const errorData = await response.json();
        showAlert('Error', errorData.message || 'Failed to update admin', 'error');
      }
    } catch (error) {
      console.error('Error updating admin:', error);
      showAlert('Error', 'Failed to update admin', 'error');
    }
  };

  const handleUpdatePassword = async () => {
    if (!editingAdmin) return;

    if (passwordUpdate.password !== passwordUpdate.confirmPassword) {
      showAlert('Error', 'Passwords do not match', 'error');
      return;
    }

    if (passwordUpdate.password.length < 6) {
      showAlert('Error', 'Password must be at least 6 characters', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3003/api/v1/admins/${editingAdmin.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: passwordUpdate.password })
      });
      
      if (response.ok) {
        setShowPasswordModal(false);
        setPasswordUpdate({ password: "", confirmPassword: "" });
        setEditingAdmin(null);
        showAlert('Success', 'Password updated successfully!', 'success');
      } else {
        const errorData = await response.json();
        showAlert('Error', errorData.message || 'Failed to update password', 'error');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showAlert('Error', 'Failed to update password', 'error');
    }
  };

  const handleDeactivateAdmin = async (adminId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3003/api/v1/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setAdmins(prev => prev.map(admin => 
          admin.id === adminId ? { ...admin, isActive: false } : admin
        ));
        showAlert('Success', 'Admin deactivated successfully!', 'success');
        fetchStats();
      } else {
        const errorData = await response.json();
        showAlert('Error', errorData.message || 'Failed to deactivate admin', 'error');
      }
    } catch (error) {
      console.error('Error deactivating admin:', error);
      showAlert('Error', 'Failed to deactivate admin', 'error');
    }
  };

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setEditAdmin({
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      isActive: admin.isActive
    });
    setShowEditModal(true);
  };

  const openPasswordModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setPasswordUpdate({ password: "", confirmPassword: "" });
    setShowPasswordModal(true);
  };

  const filteredAdmins = admins.filter(admin => {
    const searchLower = searchTerm.toLowerCase();
    return (
      admin.firstName.toLowerCase().includes(searchLower) ||
      admin.lastName.toLowerCase().includes(searchLower) ||
      admin.email.toLowerCase().includes(searchLower) ||
      admin.role.toLowerCase().includes(searchLower)
    );
  });

  const getRoleBadge = (role: string) => {
    if (role === "SUPER_ADMIN") {
      return <Badge className="bg-purple-600 text-white"><ShieldCheck className="h-3 w-3 mr-1" />Super Admin</Badge>;
    }
    return <Badge className="bg-blue-600 text-white"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-green-600 text-white"><UserCheck className="h-3 w-3 mr-1" />Active</Badge>;
    }
    return <Badge className="bg-gray-600 text-white"><UserX className="h-3 w-3 mr-1" />Inactive</Badge>;
  };

  const isSuperAdmin = currentUserRole === 'SUPER_ADMIN';

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading admins...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAdmins}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeAdmins}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                <UserX className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{stats.inactiveAdmins}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
                <ShieldCheck className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.superAdmins}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Regular Admins</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.regularAdmins}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search admins..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              {isSuperAdmin && (
                <Button onClick={() => setShowAddModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Admins Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Email</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Created</th>
                    {isSuperAdmin && <th className="text-right p-4">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="font-medium">{admin.firstName} {admin.lastName}</div>
                      </td>
                      <td className="p-4 text-gray-600">{admin.email}</td>
                      <td className="p-4">{getRoleBadge(admin.role)}</td>
                      <td className="p-4">{getStatusBadge(admin.isActive)}</td>
                      <td className="p-4 text-gray-600">
                        {new Date(admin.createdAt).toLocaleDateString()}
                      </td>
                      {isSuperAdmin && (
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(admin)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openPasswordModal(admin)}
                            >
                              <Shield className="h-4 w-4" />
                            </Button>
                            {admin.isActive && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeactivateAdmin(admin.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredAdmins.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No admins found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Admin Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setNewAdmin({
              email: "",
              password: "",
              firstName: "",
              lastName: "",
              role: "ADMIN"
            });
          }}
          title="Add New Admin"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={newAdmin.firstName}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={newAdmin.lastName}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                placeholder="admin@engracedsmile.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password * (min 6 characters)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="role">Role *</Label>
              <Select
                value={newAdmin.role}
                onValueChange={(value) => setNewAdmin(prev => ({ ...prev, role: value as "ADMIN" | "SUPER_ADMIN" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setNewAdmin({
                    email: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                    role: "ADMIN"
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddAdmin}>
                Create Admin
              </Button>
            </div>
          </div>
        </Modal>

        {/* Edit Admin Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingAdmin(null);
          }}
          title="Edit Admin"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editFirstName">First Name *</Label>
                <Input
                  id="editFirstName"
                  value={editAdmin.firstName}
                  onChange={(e) => setEditAdmin(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editLastName">Last Name *</Label>
                <Input
                  id="editLastName"
                  value={editAdmin.lastName}
                  onChange={(e) => setEditAdmin(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editEmail">Email *</Label>
              <Input
                id="editEmail"
                type="email"
                value={editAdmin.email}
                onChange={(e) => setEditAdmin(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="editRole">Role *</Label>
              <Select
                value={editAdmin.role}
                onValueChange={(value) => setEditAdmin(prev => ({ ...prev, role: value as "ADMIN" | "SUPER_ADMIN" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editIsActive"
                checked={editAdmin.isActive}
                onChange={(e) => setEditAdmin(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              <Label htmlFor="editIsActive">Active</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAdmin(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleEditAdmin}>
                Update Admin
              </Button>
            </div>
          </div>
        </Modal>

        {/* Change Password Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setEditingAdmin(null);
            setPasswordUpdate({ password: "", confirmPassword: "" });
          }}
          title="Change Password"
        >
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password * (min 6 characters)</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordUpdate.password}
                  onChange={(e) => setPasswordUpdate(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordUpdate.confirmPassword}
                onChange={(e) => setPasswordUpdate(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="••••••••"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordModal(false);
                  setEditingAdmin(null);
                  setPasswordUpdate({ password: "", confirmPassword: "" });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdatePassword}>
                Update Password
              </Button>
            </div>
          </div>
        </Modal>

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.show}
          onClose={() => setAlertModal({ ...alertModal, show: false })}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      </div>
    </AdminLayout>
  );
}

