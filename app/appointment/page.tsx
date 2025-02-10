"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Fixed: Correct import for Next.js 13+ navigation
import { gsap } from "gsap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "../contexts/AuthContext";

type Doctor = {
  _id: string;
  name: string;
  speciality: string;
  fees: number;
  availability: string;
  rating: number;
  image: string;
};

export default function BookAppointmentPage() {
  const { user } = useAuth(); 
  const router = useRouter();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setError("Failed to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!loading && doctors.length > 0) {
      gsap.from(".doctor-card", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, [loading, doctors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedDoctor || !selectedDate || !selectedTime) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          userId: user.username,
          date: selectedDate.toISOString(), 
          time: selectedTime,
          status: "upcoming",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to book appointment");
      }

      // Redirect to the appointments page
      router.push("/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError("Failed to book appointment. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading doctors...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">Book an Appointment</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {doctors.map((doctor) => (
          <Card key={doctor._id} className="doctor-card">
            <CardHeader>
              <img src={doctor.image} alt={doctor.name} />
              <CardTitle>{doctor.name}</CardTitle>
              <CardDescription>{doctor.speciality}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Fees: ₹{doctor.fees}</p>
              <p>Rating: {doctor.rating} ⭐</p>
              <Button onClick={() => setSelectedDoctor(doctor)} className="mt-4">
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedDoctor && (
        <form onSubmit={handleSubmit} className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Book appointment with {selectedDoctor.name}</h2>
          <div className="mb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
          <div className="mb-4">
            <Select onValueChange={(value) => setSelectedTime(value)}> {/* Fixed: Ensure proper function usage */}
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">09:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                {/* Add more time slots as needed */}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit">Book Appointment</Button>
        </form>
      )}
    </div>
  );
}
