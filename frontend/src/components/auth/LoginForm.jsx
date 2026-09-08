import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select'

export default function LoginForm() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('officer')
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) return // basic guard, we'll add real validation later

    // MOCK LOGIN: no backend call yet.
    // We just fabricate a user object and push it into the store.
    login({
      name: name.trim(),
      role, // 'officer' or 'admin'
    })

    navigate('/dashboard')
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Legal Metrology Checker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Officer Name</Label>
            <Input
              id="name"
              placeholder="e.g. Aditri Patil"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Login as</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="officer">Enforcement Officer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Log In
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}