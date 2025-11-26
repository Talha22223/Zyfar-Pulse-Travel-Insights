// Survey Categories and Questions Configuration
// DO NOT MODIFY - EXACT REQUIREMENTS

export const SURVEY_CATEGORIES = {
  travel_intention: {
    id: 'travel_intention',
    title: 'Travel Intention',
    emoji: '✈️',
    tagline: 'Where are you dreaming to go next?',
    questions: [
      {
        id: 'ti_q1',
        text: 'Are you planning a trip in the next 3 months?',
        type: 'single',
        options: ['Yes, definitely', 'Maybe, still deciding', 'No, not planning']
      },
      {
        id: 'ti_q2',
        text: 'Which destination are you most interested in?',
        type: 'single',
        options: ['Manali', 'Goa', 'Kerala', 'Rajasthan', 'Northeast', 'International']
      },
      {
        id: 'ti_q3',
        text: 'What type of trip do you prefer?',
        type: 'single',
        options: ['Solo adventure', 'Couple getaway', 'Family vacation', 'Friends trip']
      },
      {
        id: 'ti_q4',
        text: 'How long do you plan to travel?',
        type: 'single',
        options: ['Weekend (2-3 days)', 'Week-long (4-7 days)', 'Extended (8-14 days)', 'Long term (15+ days)']
      },
      {
        id: 'ti_q5',
        text: 'What motivates you to travel?',
        type: 'single',
        options: ['Relaxation & escape', 'Adventure & thrill', 'Cultural exploration', 'Food & cuisine', 'Photography', 'Spiritual journey']
      }
    ]
  },

  destination_experience: {
    id: 'destination_experience',
    title: 'Destination Experience',
    emoji: '🏖️',
    tagline: 'How was your last travel experience?',
    questions: [
      {
        id: 'de_q1',
        text: 'Which destination did you visit recently?',
        type: 'single',
        options: ['Beach destination', 'Hill station', 'Heritage site', 'Wildlife sanctuary', 'Pilgrimage', 'Urban exploration']
      },
      {
        id: 'de_q2',
        text: 'How would you rate your overall experience?',
        type: 'single',
        options: ['Excellent', 'Good', 'Average', 'Poor']
      },
      {
        id: 'de_q3',
        text: 'Would you recommend this destination to others?',
        type: 'single',
        options: ['Absolutely yes', 'Yes, with some tips', 'Not really', 'Definitely not']
      },
      {
        id: 'de_q4',
        text: 'What was the highlight of your trip?',
        type: 'single',
        options: ['Natural beauty', 'Local culture', 'Food & cuisine', 'Adventure activities', 'Peace & relaxation']
      },
      {
        id: 'de_q5',
        text: 'How was the local hospitality?',
        type: 'single',
        options: ['Very welcoming', 'Friendly', 'Neutral', 'Unwelcoming']
      },
      {
        id: 'de_q6',
        text: 'Did the destination meet your expectations?',
        type: 'single',
        options: ['Exceeded expectations', 'Met expectations', 'Fell short', 'Very disappointing']
      }
    ]
  },

  event_festival: {
    id: 'event_festival',
    title: 'Event & Festival',
    emoji: '🎉',
    tagline: 'Would you travel for events and festivals?',
    questions: [
      {
        id: 'ef_q1',
        text: 'Do you plan trips around festivals or events?',
        type: 'single',
        options: ['Yes, always', 'Sometimes', 'Rarely', 'Never']
      },
      {
        id: 'ef_q2',
        text: 'Which type of event interests you most?',
        type: 'single',
        options: ['Music festivals', 'Cultural festivals', 'Food festivals', 'Adventure events', 'Religious festivals']
      },
      {
        id: 'ef_q3',
        text: 'Would you travel to another city/country for a major event?',
        type: 'single',
        options: ['Absolutely', 'Only for special events', 'Probably not', 'Never']
      },
      {
        id: 'ef_q4',
        text: 'How do you discover events and festivals?',
        type: 'single',
        options: ['Social media', 'Travel websites', 'Friends/family', 'Local tourism boards', 'Random discovery']
      }
    ]
  },

  local_problems: {
    id: 'local_problems',
    title: 'Local Problems',
    emoji: '⚠️',
    tagline: 'What challenges did you face?',
    questions: [
      {
        id: 'lp_q1',
        text: 'What was the biggest issue during your last trip?',
        type: 'single',
        options: ['Overpricing', 'Poor infrastructure', 'Language barrier', 'Safety concerns', 'Overcrowding', 'No issues']
      },
      {
        id: 'lp_q2',
        text: 'Did you face any transportation problems?',
        type: 'single',
        options: ['Yes, major issues', 'Minor inconveniences', 'No problems at all']
      },
      {
        id: 'lp_q3',
        text: 'How was the cleanliness and hygiene?',
        type: 'single',
        options: ['Excellent', 'Good', 'Average', 'Poor']
      }
    ]
  },

  price_sensitivity: {
    id: 'price_sensitivity',
    title: 'Price Sensitivity',
    emoji: '💰',
    tagline: 'What is your travel budget?',
    questions: [
      {
        id: 'ps_q1',
        text: 'What is your typical budget per person for a 3-4 day trip?',
        type: 'single',
        options: ['Under ₹10,000', '₹10,000 - ₹25,000', '₹25,000 - ₹50,000', 'Above ₹50,000']
      },
      {
        id: 'ps_q2',
        text: 'Would you pay more for better amenities and comfort?',
        type: 'single',
        options: ['Yes, always', 'Sometimes, depends on the place', 'No, I prefer budget travel']
      },
      {
        id: 'ps_q3',
        text: 'Which aspect would you spend most on?',
        type: 'single',
        options: ['Accommodation', 'Food & dining', 'Activities & experiences', 'Shopping']
      }
    ]
  },

  preference: {
    id: 'preference',
    title: 'Preference',
    emoji: '💙',
    tagline: 'What kind of traveller are you?',
    questions: [
      {
        id: 'pr_q1',
        text: 'Do you prefer planned itineraries or spontaneous trips?',
        type: 'single',
        options: ['Fully planned', 'Semi-planned', 'Completely spontaneous']
      },
      {
        id: 'pr_q2',
        text: 'What time of year do you prefer to travel?',
        type: 'single',
        options: ['Peak season', 'Off-season', 'Whenever I get time']
      },
      {
        id: 'pr_q3',
        text: 'Do you prefer popular tourist spots or offbeat destinations?',
        type: 'single',
        options: ['Popular spots', 'Offbeat places', 'Mix of both']
      },
      {
        id: 'pr_q4',
        text: 'How do you usually book your trips?',
        type: 'single',
        options: ['Online travel platforms', 'Direct bookings', 'Travel agents', 'Through friends/family']
      },
      {
        id: 'pr_q5',
        text: 'What type of accommodation do you prefer?',
        type: 'single',
        options: ['Luxury hotels', 'Mid-range hotels', 'Budget hostels', 'Homestays', 'Camping/Glamping']
      },
      {
        id: 'pr_q6',
        text: 'Do you prefer guided tours or independent exploration?',
        type: 'single',
        options: ['Guided tours', 'Independent exploration', 'Mix of both']
      }
    ]
  },

  safety: {
    id: 'safety',
    title: 'Safety',
    emoji: '🛡️',
    tagline: 'How safe did you feel traveling?',
    questions: [
      {
        id: 'sf_q1',
        text: 'How safe did you feel at your last destination?',
        type: 'single',
        options: ['Very safe', 'Safe', 'Somewhat unsafe', 'Very unsafe']
      },
      {
        id: 'sf_q2',
        text: 'Did you face any safety concerns during your trip?',
        type: 'single',
        options: ['No concerns', 'Minor concerns', 'Major concerns']
      },
      {
        id: 'sf_q3',
        text: 'Is safety a deciding factor when choosing destinations?',
        type: 'single',
        options: ['Yes, absolutely', 'Yes, somewhat', 'Not really']
      }
    ]
  },

  post_trip_feedback: {
    id: 'post_trip_feedback',
    title: 'Post Trip Feedback',
    emoji: '📝',
    tagline: 'Share your travel story with us',
    questions: [
      {
        id: 'ptf_q1',
        text: 'Overall, how satisfied are you with your last trip?',
        type: 'single',
        options: ['Extremely satisfied', 'Satisfied', 'Neutral', 'Dissatisfied']
      },
      {
        id: 'ptf_q2',
        text: 'Would you visit the same destination again?',
        type: 'single',
        options: ['Yes, definitely', 'Maybe', 'No']
      },
      {
        id: 'ptf_q3',
        text: 'What would make your next trip better?',
        type: 'single',
        options: ['Better planning', 'More budget', 'Better accommodation', 'More time off', 'Better company']
      }
    ]
  },

  micro_trend: {
    id: 'micro_trend',
    title: 'Micro Trend',
    emoji: '📊',
    tagline: 'What is trending in your travel circle?',
    questions: [
      {
        id: 'mt_q1',
        text: 'What travel trend are you noticing among friends/family?',
        type: 'single',
        options: ['Workation', 'Solo travel', 'Sustainable tourism', 'Luxury travel', 'Budget backpacking']
      },
      {
        id: 'mt_q2',
        text: 'Which social media platform influences your travel decisions most?',
        type: 'single',
        options: ['Instagram', 'YouTube', 'Facebook', 'TripAdvisor', 'None']
      }
    ]
  },

  partner_feedback: {
    id: 'partner_feedback',
    title: 'Partner Feedback',
    emoji: '🤝',
    tagline: 'Help us improve partnerships',
    questions: [
      {
        id: 'pf_q1',
        text: 'Have you used any travel booking platform recently?',
        type: 'single',
        options: ['MakeMyTrip', 'Goibibo', 'Booking.com', 'Airbnb', 'OYO', 'Others']
      },
      {
        id: 'pf_q2',
        text: 'How was your experience with the platform?',
        type: 'single',
        options: ['Excellent', 'Good', 'Average', 'Poor']
      },
      {
        id: 'pf_q3',
        text: 'What improvement would you suggest for travel platforms?',
        type: 'single',
        options: ['Better pricing', 'More options', 'Easier cancellation', 'Better customer support', 'Verified reviews']
      }
    ]
  }
};

export const CATEGORY_LIST = Object.values(SURVEY_CATEGORIES);
