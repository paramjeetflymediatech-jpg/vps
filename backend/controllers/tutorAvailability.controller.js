import TutorAvailability from "../models/TutorAvailability.js";
// utils/date.js

export const normalizeDateUTC = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);

  // Create UTC date directly (NO timezone conversion)
  return new Date(Date.UTC(year, month - 1, day));
};

// Get tutor's availability for a specific week
export const getAvailability = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { date } = req.query;

    // 1️⃣ Calculate week start (Monday) if not provided
    let startDate;

    if (date) {
      startDate = new Date(date);
    } else {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0=Sunday
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);
      startDate = monday;
    }

    // 2️⃣ Calculate week end (Sunday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);

    // 3️⃣ Find all availability for the week
    const availability = await TutorAvailability.find({
      tutorId,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: 1 })
      .lean();
    // 4️⃣ Format data to match frontend logic
    let formatted = availability.map((day) => ({
      date: day.date,
      availability: day.availability.map((slot) => ({
        startTime: slot.startTime, // "09:00"
        endTime: slot.endTime, // "10:00"
        isAvailable: slot.isAvailable,
        isBooked: slot.isBooked,
      })),
    }));
 
    res.status(200).json({
      success: true,
      data: formatted.length ? formatted : [],
      message: formatted.length
        ? "Availability fetched"
        : "No availability set for this week",
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
      error: error.message,
    });
  }
};

// export const getAvailability = async (req, res) => {
//   try {
//     const tutorId = req.user.id;
//     const { date } = req.query;

//     // 1️⃣ Calculate week start (Monday)
//     let startDate;

//     if (date) {
//       startDate = new Date(date);
//       startDate.setHours(0, 0, 0, 0);
//     } else {
//       const today = new Date();
//       const dayOfWeek = today.getDay(); // 0 = Sunday
//       const monday = new Date(today);
//       monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
//       monday.setHours(0, 0, 0, 0);
//       startDate = monday;
//     }

//     // 2️⃣ Calculate week end (Sunday)
//     const endDate = new Date(startDate);
//     endDate.setDate(startDate.getDate() + 6);
//     endDate.setHours(23, 59, 59, 999);

//     // 3️⃣ Fetch availability
//     const availability = await TutorAvailability.find({
//       tutorId,
//       date: { $gte: startDate, $lte: endDate },
//     })
//       .sort({ date: 1 })
//       .lean();

//     // 4️⃣ Format for frontend (WITH SLOT INFO)
//     const formatted = availability.map((day) => ({
//       date: day.date,
//       availability: day.availability.map((slot) => ({
//         slotId: slot._id,              // ✅ important
//         startTime: slot.startTime,
//         endTime: slot.endTime,
//         isAvailable: slot.isAvailable,
//         isBooked: slot.isBooked,       // ✅ added
//       })),
//     }));

//     return res.status(200).json({
//       success: true,
//       data: formatted,
//       message: formatted.length
//         ? "Availability fetched"
//         : "No availability set for this week",
//     });
//   } catch (error) {
//     console.error("Error fetching availability:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch availability",
//       error: error.message,
//     });
//   }
// };

export const saveAvailability = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { date, availability } = req.body;

    if (!date || !availability) {
      return res.status(400).json({
        success: false,
        message: "date and availability are required",
      });
    }

    const normalizedDate = normalizeDateUTC(date);

    const existing = await TutorAvailability.findOne({
      tutorId,
      date: normalizedDate,
    });

    if (existing) {
      // Merge incoming availability with existing
      const mergedAvailability = [...existing.availability];

      availability.forEach((newSlot) => {
        const index = mergedAvailability.findIndex(
          (slot) =>
            slot.startTime === newSlot.startTime &&
            slot.endTime === newSlot.endTime,
        );

        if (index !== -1) {
          // Update existing slot
          mergedAvailability[index] = {
            ...mergedAvailability[index],
            ...newSlot,
          };
        } else {
          // Add new slot
          mergedAvailability.push(newSlot);
        }
      });

      existing.availability = mergedAvailability;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Availability updated",
        data: existing,
      });
    }

    const newAvailability = new TutorAvailability({
      tutorId,
      date: normalizedDate,
      availability,
    });

    await newAvailability.save();

    return res.status(201).json({
      success: true,
      message: "Availability saved",
      data: newAvailability,
    });
  } catch (error) {
    console.error("Save availability error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete tutor's availability for a specific week
export const deleteAvailability = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { id } = req.params;

    const availability = await TutorAvailability.findOne({
      _id: id,
      tutorId,
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: "Availability not found",
      });
    }

    await TutorAvailability.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Availability deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete availability",
      error: error.message,
    });
  }
};

// Get availability by tutor ID (for students to view)
export const getAvailabilityByTutorId = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const { weekStartDate } = req.query;

    let startDate;
    if (weekStartDate) {
      startDate = new Date(weekStartDate);
    } else {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const monday = new Date(today);
      monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
      monday.setHours(0, 0, 0, 0);
      startDate = monday;
    }

    const availability = await TutorAvailability.findOne({
      tutorId,
      weekStartDate: startDate,
    });

    if (!availability) {
      return res.status(200).json({
        success: true,
        message: "No availability set for this week",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error) {
    console.error("Error fetching tutor availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor availability",
      error: error.message,
    });
  }
};
