"use client"


import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Patient {
  name: string
  age: number
  condition: string
  symptoms: string[]
  history: string
  medications: string[]
  lastVisit: string
  notes: string
}

export default function PatientDetailPage() {
  const { id } = useParams()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(`/api/patients/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch patient details')
        }
        const data = await response.json()
        setPatient(data)
      } catch (err) {
        setError('Error fetching patient details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientDetails()
  }, [id])

  useEffect(() => {
    if (!loading && patient) {
      gsap.from(".detail-card", {
        opacity: 0,
        y: 50,
        rotationX: 45,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      })
    }
  }, [loading, patient])

  if (loading) return <div>Loading patient details...</div>
  if (error) return <div>Error: {error}</div>
  if (!patient) return <div>Patient not found</div>

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 font-montserrat">Patient Details</h1>
      <div className="grid gap-6">
        <Card className="detail-card">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Name:</p>
                <p>{patient.name}</p>
              </div>
              <div>
                <p className="font-semibold">Age:</p>
                <p>{patient.age}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="detail-card">
          <CardHeader>
            <CardTitle>Medical Condition</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">Current Condition:</p>
            <p>{patient.condition}</p>
            <p className="font-semibold mt-4">Symptoms:</p>
            <ul className="list-disc list-inside">
              {patient.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="detail-card">
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{patient.history}</p>
          </CardContent>
        </Card>

        <Card className="detail-card">
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              {patient.medications.map((medication, index) => (
                <li key={index}>{medication}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="detail-card">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{patient.notes}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

