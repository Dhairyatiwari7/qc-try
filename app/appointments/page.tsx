"use client"

import { useEffect, useState } from "react"
import { gsap } from "gsap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "../contexts/AuthContext" 

type Appointment = {
  id: string
  doctorName: string
  date: string
  time: string
  status: "upcoming" | "completed" | "cancelled"
}

export default function AppointmentsPage() {
  const { user } = useAuth() 
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setError("You must be logged in to view your appointments.")
      setLoading(false)
      return
    }

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`/api/appointments/user/${user.id}`) // Use dynamic user ID
        if (!response.ok) {
          throw new Error("Failed to fetch appointments")
        }
        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
        setError("Failed to load appointments. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [user])

  useEffect(() => {
    if (!loading && appointments.length > 0) {
      gsap.from(".appointment-card", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      })
    }
  }, [loading, appointments])

  if (loading) {
    return <div className="text-center py-12">Loading appointments...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Appointments</h1>
      {appointments.length > 0 ? (
        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <Card key={appointment.id} className="appointment-card">
              <CardHeader>
                <CardTitle>{appointment.doctorName}</CardTitle>
                <CardDescription>Appointment ID: {appointment.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
                <p>Time: {appointment.time}</p>
                <p className="capitalize">Status: {appointment.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl mb-4">No appointments remaining</p>
          <p className="text-gray-600 mb-8">Book a new appointment to get started</p>
        </div>
      )}
      <div className="mt-8 text-center">
        <Button asChild>
          <Link href="/appointment">Book New Appointment</Link>
        </Button>
      </div>
    </div>
  )
}
