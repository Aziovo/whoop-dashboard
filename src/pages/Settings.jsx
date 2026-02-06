import { useState, useEffect } from 'react'
import { User, Settings as SettingsIcon, Download, Upload, LogOut } from 'lucide-react'
import Card from '../components/Card'
import { settingsStorage, userProfileStorage, exportData, importData, downloadJSON } from '../utils/storage'
import { useWhoop } from '../context/WhoopContext'

const Settings = () => {
  const { isAuthenticated, logout, usingDemoData } = useWhoop()
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: ''
  })
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'nl',
    notifications: true,
    whoopIntegration: false
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = () => {
    setProfile(userProfileStorage.get())
    setSettings(settingsStorage.get())
  }

  const handleProfileSave = () => {
    userProfileStorage.set(profile)
    alert('Profiel opgeslagen!')
  }

  const handleSettingsSave = () => {
    settingsStorage.set(settings)
    alert('Instellingen opgeslagen!')
  }

  const handleExport = () => {
    downloadJSON(`dashboard-export-${new Date().toISOString().split('T')[0]}.json`)
    alert('Data geëxporteerd!')
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          if (importData(data)) {
            alert('Data succesvol geïmporteerd!')
            window.location.reload()
          } else {
            alert('Import mislukt. Controleer het bestand.')
          }
        } catch (error) {
          alert('Ongeldig bestand format.')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleWhoopDisconnect = () => {
    if (confirm('Weet je zeker dat je je Whoop account wilt loskoppelen?')) {
      logout()
      alert('Whoop account losgekoppeld')
    }
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-header">Instellingen</h1>
          <p className="text-gray-400">Beheer je profiel en voorkeuren</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-whoop-lightgray">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'profile'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profiel</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'settings'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5" />
            <span>Voorkeuren</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('data')}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === 'data'
              ? 'text-whoop-primary border-b-2 border-whoop-primary'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Data</span>
          </div>
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl">
          <Card>
            <h3 className="font-bold mb-6">Persoonlijke Informatie</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Naam</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="input-field w-full"
                  placeholder="Je naam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="input-field w-full"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Avatar URL</label>
                <input
                  type="url"
                  value={profile.avatar}
                  onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                  className="input-field w-full"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="textarea-field w-full"
                  rows="4"
                  placeholder="Vertel iets over jezelf..."
                />
              </div>

              <button onClick={handleProfileSave} className="btn-primary w-full">
                Profiel Opslaan
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <h3 className="font-bold mb-6">Algemene Instellingen</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-whoop-lightgray rounded-lg">
                <div>
                  <p className="font-semibold">Thema</p>
                  <p className="text-sm text-gray-400">Kies je voorkeursthema</p>
                </div>
                <select
                  value={settings.theme}
                  onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                  className="select-field"
                >
                  <option value="dark">Donker</option>
                  <option value="light">Licht</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-whoop-lightgray rounded-lg">
                <div>
                  <p className="font-semibold">Taal</p>
                  <p className="text-sm text-gray-400">Interface taal</p>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="select-field"
                >
                  <option value="nl">Nederlands</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-whoop-lightgray rounded-lg">
                <div>
                  <p className="font-semibold">Notificaties</p>
                  <p className="text-sm text-gray-400">Ontvang meldingen</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-whoop-primary"></div>
                </label>
              </div>

              <button onClick={handleSettingsSave} className="btn-primary w-full">
                Instellingen Opslaan
              </button>
            </div>
          </Card>

          {/* Whoop Integration */}
          <Card>
            <h3 className="font-bold mb-6">Whoop Integratie</h3>
            <div className="space-y-4">
              {isAuthenticated ? (
                <div className="p-4 bg-green-500/20 rounded-lg border-2 border-green-500/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-500">✓ Verbonden</p>
                      <p className="text-sm text-gray-400">Je Whoop account is gekoppeld</p>
                    </div>
                    <button
                      onClick={handleWhoopDisconnect}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Loskoppelen</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-500/20 rounded-lg border-2 border-yellow-500/50">
                  <p className="font-semibold text-yellow-500 mb-2">
                    {usingDemoData ? '⚠️ Demo Modus' : '○ Niet Verbonden'}
                  </p>
                  <p className="text-sm text-gray-400 mb-4">
                    {usingDemoData 
                      ? 'Je gebruikt demo data. Koppel je Whoop voor realtime metingen.'
                      : 'Koppel je Whoop account voor realtime gezondheidsdata.'}
                  </p>
                  <button className="btn-primary" onClick={() => window.location.href = '/whoop'}>
                    Naar Whoop Pagina
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Data Tab */}
      {activeTab === 'data' && (
        <div className="max-w-2xl space-y-6">
          <Card>
            <h3 className="font-bold mb-6">Data Beheer</h3>
            <div className="space-y-4">
              <div className="p-4 bg-whoop-lightgray rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold">Exporteer Data</p>
                    <p className="text-sm text-gray-400">
                      Download al je data als JSON bestand
                    </p>
                  </div>
                  <Download className="w-8 h-8 text-blue-500 opacity-50" />
                </div>
                <button onClick={handleExport} className="btn-primary w-full">
                  Download JSON
                </button>
              </div>

              <div className="p-4 bg-whoop-lightgray rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold">Importeer Data</p>
                    <p className="text-sm text-gray-400">
                      Upload een eerder geëxporteerd bestand
                    </p>
                  </div>
                  <Upload className="w-8 h-8 text-green-500 opacity-50" />
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                />
                <label htmlFor="import-file" className="btn-secondary w-full block text-center cursor-pointer">
                  Selecteer Bestand
                </label>
              </div>

              <div className="p-4 bg-red-500/20 rounded-lg border-2 border-red-500/50">
                <p className="font-semibold text-red-500 mb-2">⚠️ Danger Zone</p>
                <p className="text-sm text-gray-400 mb-4">
                  Let op: Deze actie kan niet ongedaan gemaakt worden.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Weet je ZEKER dat je alle data wilt wissen? Dit kan niet ongedaan gemaakt worden!')) {
                      localStorage.clear()
                      alert('Alle data gewist.')
                      window.location.reload()
                    }
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg w-full transition-all"
                >
                  Wis Alle Data
                </button>
              </div>
            </div>
          </Card>

          {/* Info */}
          <Card>
            <h3 className="font-bold mb-4">Over Deze App</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p><strong className="text-white">Versie:</strong> 1.0.0</p>
              <p><strong className="text-white">Gebouwd met:</strong> React 18 + Vite + TailwindCSS</p>
              <p><strong className="text-white">Data Opslag:</strong> localStorage (browser)</p>
              <p><strong className="text-white">Whoop API:</strong> v2</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Settings
