import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Globe, Database } from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Prashishksan',
    siteDescription: 'An app for Academia Industry Interface',
    allowRegistration: true,
    requireApproval: false,
    enableNotifications: true,
    enableChat: true,
    maintenanceMode: false,
    maxFileSize: '10',
    allowedFileTypes: 'jpg,png,pdf,doc,docx',
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
    // Here you would typically save to backend
  };

  const SettingGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  const SettingRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center justify-between py-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="h-7 w-7 mr-3 text-purple-600" />
            System Settings
          </h1>
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>

        {/* General Settings */}
        <SettingGroup title="General Settings">
          <SettingRow label="Site Name">
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
            />
          </SettingRow>
          <SettingRow label="Site Description">
            <input
              type="text"
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
            />
          </SettingRow>
          <SettingRow label="Maintenance Mode">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </SettingRow>
        </SettingGroup>

        {/* User Management */}
        <SettingGroup title="User Management">
          <SettingRow label="Allow New Registrations">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={(e) => setSettings({ ...settings, allowRegistration: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </SettingRow>
          <SettingRow label="Require Admin Approval">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </SettingRow>
        </SettingGroup>

        {/* Features */}
        <SettingGroup title="Features">
          <SettingRow label="Enable Notifications">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </SettingRow>
          <SettingRow label="Enable Chat">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableChat}
                onChange={(e) => setSettings({ ...settings, enableChat: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </SettingRow>
        </SettingGroup>

        {/* File Upload Settings */}
        <SettingGroup title="File Upload">
          <SettingRow label="Max File Size (MB)">
            <input
              type="number"
              value={settings.maxFileSize}
              onChange={(e) => setSettings({ ...settings, maxFileSize: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 w-20"
            />
          </SettingRow>
          <SettingRow label="Allowed File Types">
            <input
              type="text"
              value={settings.allowedFileTypes}
              onChange={(e) => setSettings({ ...settings, allowedFileTypes: e.target.value })}
              className="border border-gray-300 rounded-md px-3 py-2 w-64"
              placeholder="jpg,png,pdf,doc,docx"
            />
          </SettingRow>
        </SettingGroup>
      </div>
    </div>
  );
};

export default SystemSettings;