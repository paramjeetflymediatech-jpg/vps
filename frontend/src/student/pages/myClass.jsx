"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getTutors } from "@/api/tutorApi";
import {
  getStudentClasses,
  checkPaymentStatus,
  saveSelectedSlot,
} from "@/api/student.api";

/* =========================
   DATE HELPERS
========================= */
const getNext7Dates = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const isoDate = new Date(
      Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
    ).toISOString();

    return {
      date: isoDate,
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : names[d.getDay()],
      dateNum: d.getDate(),
    };
  });
};

/* =========================
   SLOT VALIDATION
========================= */
const isFutureSlot = (date, startTime) => {
  const now = new Date();
  const [h, m] = startTime.split(":").map(Number);

  const [year, month, day] = date.split("T")[0].split("-").map(Number);
  const slotDate = new Date(year, month - 1, day, h, m, 0);

  return slotDate > now;
};

const BookSession = () => {
  const dates = getNext7Dates();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDate, setActiveDate] = useState(dates[0].date);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [searchName, setSearchName] = useState("");

  /* =========================
     FETCH TUTORS & AVAILABILITY
  ========================= */
  useEffect(() => {
    const loadTutorsAndAvailability = async () => {
      try {
        setLoading(true);

        // 1️⃣ Load tutors
        const tutorsRes = await getTutors();
        const tutorsList = tutorsRes.data?.data || [];
        const tutorsData = tutorsList.map((tutor) => ({
          id: tutor._id,
          name: tutor.name,
          email: tutor.email,
          avatar: tutor.avatar || `https://i.pravatar.cc/150?u=${tutor.email}`,
          availability: [],
        }));

        // 2️⃣ Load availability for first active date
        const availabilityRes = await getStudentClasses({ activeDate });
        const availabilityList = availabilityRes.data?.data || [];

        // 3️⃣ Merge availability into tutors
        const mergedData = tutorsData.map((tutor) => {
          const avail = availabilityList
            .filter(
              (a) => a.tutorId?._id?.toString() === tutor.id?.toString()
            )
            .map((a) => ({
              date: a.date,
              slots: a.availability,
            }));
          return { ...tutor, availability: avail };
        });

        setData(mergedData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load tutors or availability");
      } finally {
        setLoading(false);
      }
    };

    loadTutorsAndAvailability();
  }, []);

  /* =========================
     FETCH AVAILABILITY WHEN DATE CHANGES
  ========================= */
  useEffect(() => {
    if (!data.length) return; // wait until tutors are loaded

    const loadAvailabilityForDate = async () => {
      try {
        // setLoading(true);
        const availabilityRes = await getStudentClasses({ activeDate });
        const availabilityList = availabilityRes.data?.data || [];

        setData((prev) =>
          prev.map((tutor) => {
            const avail = availabilityList
              .filter(
                (a) => a.tutorId?._id?.toString() === tutor.id?.toString()
              )
              .map((a) => ({
                date: a.date,
                slots: a.availability,
              }));
            return { ...tutor, availability: avail };
          })
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to load availability");
      } finally {
        // setLoading(false);
      }
    };

    loadAvailabilityForDate();

    // reset selection when date changes
    setSelectedSlot(null);
    setSelectedTutor(null);
  }, [activeDate]);

  /* =========================
     FILTER TUTORS PER ACTIVE DATE
  ========================= */
  const tutors = useMemo(() => {
    return data
      .map((tutor) => {
        const dayAvailability = tutor.availability.find(
          (a) => a.date && a.date.split("T")[0] === activeDate.split("T")[0]
        );
        if (!dayAvailability) return null;

        const slots = dayAvailability.slots
          .filter(
            (s) => s.isAvailable && !s.isBooked && isFutureSlot(activeDate, s.startTime)
          )
          .map((s) => ({
            slotId: s._id,
            startTime: s.startTime,
            endTime: s.endTime,
            label: `${s.startTime} - ${s.endTime}`,
          }));
        if (!slots.length) return null;

        return {
          id: tutor.id,
          tutorId: tutor.id,
          name: tutor.name,
          date: dayAvailability.date,
          image: tutor.avatar,
          slots,
        };
      })
      .filter(Boolean)
      .filter((t) => t.name?.toLowerCase().includes(searchName.toLowerCase()));
  }, [data, activeDate, searchName]);

  /* =========================
     HANDLE BOOKING
  ========================= */
  const handleBookNow = () => {
    if (!selectedSlot || !selectedTutor) {
      toast.error("Please select a slot");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmBooking = async () => {
    try {
      setPaymentMessage("");
      const res = await checkPaymentStatus(selectedTutor.tutorId);

      const paid = res.data?.paid;
      const status = res.data?.status;

      if (paid && status === "SUCCESS") {
        await saveSelectedSlot({
          tutorId: selectedTutor.tutorId,
          date: selectedTutor.date,
          slot: selectedSlot,
        });
        setPaymentMessage("Slot booked successfully!");
        setSelectedSlot(null);
        setSelectedTutor(null);
        setShowConfirm(false);
        return;
      }

      if (paid && status !== "SUCCESS") {
        setPaymentMessage("Please wait for admin payment confirmation.");
        return;
      }

      // Redirect to payment
      window.location.href = `/CoursesPricing?tutorId=${selectedTutor.tutorId}&time=${selectedSlot.startTime}`;
    } catch (err) {
      console.error(err);
      setPaymentMessage("Something went wrong. Try again later.");
    }
  };
  console.log(selectedSlot, selectedTutor);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-10 bg-[#FBFCFF] min-h-screen pt-5 space-y-8 overflow-x-hidden">
      <Toaster />

      <h1 className="text-3xl font-black mt-10">Book a Session</h1>

      {/* PAYMENT MESSAGE */}
      {paymentMessage && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 p-4 rounded-xl">
          {paymentMessage}
        </div>
      )}

      {/* DATE SELECTOR */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => setActiveDate(d.date)}
            className={`w-16 h-16 rounded-xl font-bold shrink-0 ${activeDate === d.date
              ? "bg-[#6335F8] text-white"
              : "bg-purple-50 text-[#6335F8]"
              }`}
          >
            <div className="text-xs">{d.label}</div>
            <div className="text-lg">{d.dateNum}</div>
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="flex gap-2">
        <input
          placeholder="Search tutor"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full flex-1"
        />
        <button className="bg-[#6335F8] text-white px-4 rounded-lg">
          <Search size={16} />
        </button>
      </div>

      {/* TUTORS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.length ? (
          tutors.map((tutor) => (
            <div key={tutor.id} className="border p-4 rounded-xl">
              <div className="flex justify-between mb-3">
                <h3 className="font-bold">{tutor.name}</h3>
                <img src={tutor.image} className="w-12 h-12 rounded-full" />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {tutor.slots.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedSlot({
                        _id: slot.slotId,
                        tutorId: tutor.tutorId,
                        date: activeDate,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                      });
                      setSelectedTutor(tutor);
                    }}
                    className={`px-3 py-1 text-xs rounded-lg border ${selectedSlot?.tutorId === tutor.tutorId &&
                      selectedSlot?.startTime === slot.startTime
                      ? "bg-[#6335F8] text-white"
                      : ""
                      }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleBookNow}
                className="w-full bg-[#6335F8] text-white py-2 rounded-lg"
              >
                Book Now
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No tutors available for this date
          </p>
        )}
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-2xl">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4"
            >
              <X />
            </button>

            <p className="font-bold mb-4">
              Confirm booking with {selectedTutor?.name}
            </p>

            <p className="text-sm mb-4">
              {selectedSlot?.date.split("T")[0]} | {selectedSlot?.startTime} -{" "}
              {selectedSlot?.endTime}
            </p>

            <button
              onClick={handleConfirmBooking}
              className="w-full bg-[#6335F8] text-white py-2 rounded-lg"
            >
              Proceed to Book
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookSession;
