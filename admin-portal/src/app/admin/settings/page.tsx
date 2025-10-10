"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertModal } from "@/components/ui/modal";
import { 
  Settings, 
  Eye, 
  EyeOff, 
  Save, 
  CreditCard, 
  Mail, 
  Bell,
  Shield,
  Globe,
  RefreshCw
} from "lucide-react";

export default function SettingsPage() {
  const [showPasswords, setShowPasswords] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alertModal, setAlertModal] = useState<{show: boolean; title: string; message: string; type: 'success' | 'error' | 'info'}>({
    show: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Settings state
  const [settings, setSettings] = useState({
    // General Settings
    app_name: 'Engracedsmile',
    app_url: 'https://engracedsmile.com',
    admin_url: 'https://admin.engracedsmile.com',
    maintenance_mode: false,
    
    // Payment Settings
    paystack_public_key: '',
    paystack_secret_key: '',
    payment_currency: 'NGN',
    
    // Email Settings
    smtp_host: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
    smtp_from_email: '',
    smtp_from_name: '',
    
    // Notification Settings
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    
    // Security Settings
    session_timeout: '30',
    max_login_attempts: '5',
    password_min_length: '8',
    require_email_verification: true,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('https://engracedsmile.com/api/v1/system/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      showAlert('Error', 'Failed to load settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('adminToken');

      // Convert settings to array format
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        type: typeof value === 'boolean' ? 'boolean' : 
              typeof value === 'number' ? 'number' : 'string'
      }));

      const response = await fetch('https://engracedsmile.com/api/v1/system/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings: settingsArray })
      });

      if (response.ok) {
        showAlert('Success', 'Settings saved successfully!', 'success');
      } else {
        const errorData = await response.json();
        showAlert('Error', `Failed to save settings: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showAlert('Error', 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    setAlertModal({ show: true, title, message, type });
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-[#5d4a15]" />
          <span className="ml-2">Loading settings...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-end items-center">
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#5d4a15] hover:bg-[#6b5618]"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="grid gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic application configuration and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="app_name">Application Name</Label>
                  <Input 
                    id="app_name" 
                    value={settings.app_name}
                    onChange={(e) => updateSetting('app_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app_url">Application URL</Label>
                  <Input 
                    id="app_url" 
                    value={settings.app_url}
                    onChange={(e) => updateSetting('app_url', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin_url">Admin Portal URL</Label>
                <Input 
                  id="admin_url" 
                  value={settings.admin_url}
                  onChange={(e) => updateSetting('admin_url', e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="maintenance" 
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                />
                <Label htmlFor="maintenance">Maintenance Mode</Label>
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>
                Configure payment gateway settings and API keys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="paystack_public_key">Paystack Public Key</Label>
                  <div className="relative">
                    <Input 
                      id="paystack_public_key" 
                      type={showPasswords ? "text" : "password"}
                      value={settings.paystack_public_key}
                      onChange={(e) => updateSetting('paystack_public_key', e.target.value)}
                      placeholder="pk_test_..."
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPasswords(!showPasswords)}
                    >
                      {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="paystack_secret_key">Paystack Secret Key</Label>
                  <Input 
                    id="paystack_secret_key" 
                    type={showPasswords ? "text" : "password"}
                    value={settings.paystack_secret_key}
                    onChange={(e) => updateSetting('paystack_secret_key', e.target.value)}
                    placeholder="sk_test_..."
                  />
                </div>

                <div>
                  <Label htmlFor="payment_currency">Payment Currency</Label>
                  <Input 
                    id="payment_currency" 
                    value={settings.payment_currency}
                    onChange={(e) => updateSetting('payment_currency', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Settings
              </CardTitle>
              <CardDescription>
                Configure SMTP settings for sending emails.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp_host">SMTP Host</Label>
                  <Input 
                    id="smtp_host" 
                    value={settings.smtp_host}
                    onChange={(e) => updateSetting('smtp_host', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_port">SMTP Port</Label>
                  <Input 
                    id="smtp_port" 
                    type="number"
                    value={settings.smtp_port}
                    onChange={(e) => updateSetting('smtp_port', e.target.value)}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp_username">SMTP Username</Label>
                  <Input 
                    id="smtp_username" 
                    value={settings.smtp_username}
                    onChange={(e) => updateSetting('smtp_username', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_password">SMTP Password</Label>
                  <Input 
                    id="smtp_password" 
                    type={showPasswords ? "text" : "password"}
                    value={settings.smtp_password}
                    onChange={(e) => updateSetting('smtp_password', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="smtp_from_email">From Email</Label>
                  <Input 
                    id="smtp_from_email" 
                    type="email"
                    value={settings.smtp_from_email}
                    onChange={(e) => updateSetting('smtp_from_email', e.target.value)}
                    placeholder="noreply@engracedsmile.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp_from_name">From Name</Label>
                  <Input 
                    id="smtp_from_name" 
                    value={settings.smtp_from_name}
                    onChange={(e) => updateSetting('smtp_from_name', e.target.value)}
                    placeholder="Engracedsmile"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure notification preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch 
                  id="email_notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms_notifications">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                </div>
                <Switch 
                  id="sms_notifications"
                  checked={settings.sms_notifications}
                  onCheckedChange={(checked) => updateSetting('sms_notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push_notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive push notifications</p>
                </div>
                <Switch 
                  id="push_notifications"
                  checked={settings.push_notifications}
                  onCheckedChange={(checked) => updateSetting('push_notifications', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security and authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="session_timeout" 
                    type="number"
                    value={settings.session_timeout}
                    onChange={(e) => updateSetting('session_timeout', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                  <Input 
                    id="max_login_attempts" 
                    type="number"
                    value={settings.max_login_attempts}
                    onChange={(e) => updateSetting('max_login_attempts', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password_min_length">Min Password Length</Label>
                  <Input 
                    id="password_min_length" 
                    type="number"
                    value={settings.password_min_length}
                    onChange={(e) => updateSetting('password_min_length', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="require_email_verification"
                  checked={settings.require_email_verification}
                  onCheckedChange={(checked) => updateSetting('require_email_verification', checked)}
                />
                <Label htmlFor="require_email_verification">Require Email Verification</Label>
              </div>
            </CardContent>
          </Card>

          {/* Save Button at bottom */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              size="lg"
              className="bg-[#5d4a15] hover:bg-[#6b5618]"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        </div>

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

