import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useCalendar } from "../../context/CalendarContext";
import { useHistory } from "react-router-dom";
import { getSpotBookingsThunk, createBookingsThunk } from "../../store/bookingsReducer";
import { format } from "date-fns";
import Calendar from "./Calendar";
import "./Bookings.css";

const Bookings = ({ spotId }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const calendarRef = useRef();
  const [focus, setFocus] = useState("");
  const [numOfDays, setNumOfDays] = useState(0);
  const [formattedDate, setFormattedDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const bookings = useSelector((state) => Object.values(state.bookings));

  const { setOnStartDate, booking, setBooking, startDate, setStartDate, endDate, setEndDate } =
    useCalendar();

  ////// bookings logic ///////
  useEffect(() => {
    dispatch(getSpotBookingsThunk(spotId));
  }, [dispatch, spotId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    history.push(`/booking/spots/${spotId}`);
    // const formattedStartDate = format(startDate, "Y-MM-dd");
    // const formattedEndDate = format(endDate, "Y-MM-dd");
    // const requestedDates = { startDate: formattedStartDate, endDate: formattedEndDate };
    // await dispatch(createBookingsThunk(spotId, requestedDates));
    // clearDates(true);
  };
  ////// calendar logic ///////
  const openCalendar = () => {
    setOnStartDate(true);
    setShowCalendar(true);
    setFocus(1);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
    setFocus("");
  };

  useEffect(() => {
    if (!showCalendar) return;

    document.addEventListener("click", (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        closeCalendar(true);
      }
    });
    return () => document.removeEventListener("click", closeCalendar);
  }, [showCalendar]);

  useEffect(() => {
    if (startDate && !endDate) {
      setFocus(2);
      setNumOfDays(0);
      setFormattedDate("");
    }
    if (startDate && endDate) {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      const formattedStartDate = startDate.toLocaleString("en-US", options);
      const formattedEndDate = endDate.toLocaleString("en-US", options);
      if (new Date(formattedStartDate).getTime() < new Date(formattedEndDate).getTime()) {
        setFormattedDate(`${formattedStartDate} - ${formattedEndDate}`);
        setNumOfDays((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        closeCalendar();
      }
    }
  }, [startDate, endDate]);

  const clearDates = (submitted) => {
    const dates = booking[0];

    if (submitted) setFocus("");
    else setFocus(1);
    dates.startDate = null;
    dates.endDate = new Date("");
    setStartDate("");
    setEndDate("");
    setNumOfDays(0);
    setFormattedDate("");
    setBooking([dates]);
    setOnStartDate(true);
  };

  return (
    <div ref={calendarRef}>
      <div className="bookings-container" ref={calendarRef}>
        <div
          className={`start-date-container ${
            focus === 1 ? "focused" : focus === 2 ? "unfocused" : null
          }`}
          onClick={openCalendar}
        >
          <p id="checkin-text">CHECK-IN</p>
          <p id="start-date-text">
            {startDate ? startDate.toLocaleDateString("en-US") : "Add Date"}
          </p>
        </div>
        <div
          className={`end-date-container ${
            focus === 2 ? "focused" : focus === 1 ? "unfocused" : null
          }`}
          onClick={openCalendar}
        >
          <p id="checkout-text">CHECKOUT</p>
          <p id="end-date-text">{endDate ? endDate.toLocaleDateString("en-US") : "Add Date"}</p>
        </div>
        <div className={`calendar-container ${!showCalendar ? "hidden" : ""}`}>
          <div className="month-container">
            <div className="booking-summary-review">
              <h2>
                {numOfDays
                  ? `${Math.round(numOfDays)} ${Math.round(numOfDays) === 1 ? "night" : "nights"}`
                  : "Select dates"}
              </h2>
              <p>
                {formattedDate ? `${formattedDate}` : "Add your travel dates for exact pricing"}
              </p>
            </div>
            <Calendar bookings={bookings} />
            <div className="buttons-end">
              <button className="clear-button" onClick={() => clearDates(false)}>
                Clear Dates
              </button>
              <button className="black-button" onClick={closeCalendar}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="booking-button-container">
        {startDate && endDate ? (
          <button className="pink-button reserve" onClick={(e) => handleBooking(e)}>
            Reserve
          </button>
        ) : (
          <button className="pink-button reserve" onClick={openCalendar}>
            Check Availability
          </button>
        )}
      </div>
    </div>
  );
};

export default Bookings;
