"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Appointment {
  _id: string;
  userId: string;
  patientName: string; // Added patient name
  date: string;
  time: string;
  status: string;
}

export default function DoctorAppointmentsPage() {
  const { user } = useAuth(); // Get the logged-in doctor's details
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || user.role !== 'doctor') {
        setError("Unauthorized access. Please log in as a doctor.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/appointments/doctor/${user.username}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError("Failed to load appointments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  if (loading) {
    return <div className="text-center py-12">Loading appointments...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Patients</h1>
      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <div key={appointment._id}>
            <p>User ID: {appointment.userId}</p>
            <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
            <p>Time: {appointment.time}</p>
            <p>Status: {appointment.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
