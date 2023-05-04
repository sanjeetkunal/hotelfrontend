import { useEffect, useState } from 'react'
import { motion, useAnimation, useScroll, useSpring } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useNavigate, createSearchParams } from 'react-router-dom'
import '../../../styles/home/BookingCarousel.scss'
import client from '../../../client'
import arrow from '../../../images/arrowVector.svg'
import guest from '../../../images/guests.svg'
import hotel from '../../../images/hotel.svg'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import Box from '@mui/material/Box'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Search } from '@mui/icons-material'

const boxVariant = {
    visible: { opacity: 1, translateY: 0, transition: { duration: .65 } },
    hidden: { opacity: 0, translateY: '3vw' },
}

function BookingCarousel() {

    const nav = useNavigate()
    const [checkIn, setCheckIn] = useState(new Date())
    const tommorow = new Date().setDate(checkIn.getDate()+1)
    const [checkOut, setCheckOut] = useState(new Date(tommorow))
    const [guests, setGuests] = useState(2)

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [n, setN] = useState(0)
    const [suggestions, setSuggestions] = useState([])
    const control = useAnimation()
    const [ref, inView] = useInView()
    const mouseClickEvents = ["mousedown", "click", "mouseup"];
    
    const { scrollY } = useScroll();
    const translateY = useSpring(scrollY, {
        stiffness: 100,
        damping: 30,
        restDelta: 1,
        
    });

    const getDateDifference = (checkInDate, checkOutDate) => {
      var timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      var dayDiff =  timeDiff / (1000 * 3600 * 24);
      return Math.ceil(dayDiff);
    }

    const simulateMouseClick = (element) => {
      mouseClickEvents.forEach((mouseEventType) =>
        element.dispatchEvent(
          new MouseEvent(mouseEventType, {
            view: window,
            bubbles: true,
            cancelable: true,
            buttons: 1,
          })
        )
      );
    }

    const translateY2 = useSpring(scrollY, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.01,
        
      });

    const[prog,setProg] = useState(translateY.current)
    translateY.onChange((current, value) => {setProg(current)})

    const onSubmit = () => {
        if (n == -1) {
            nav(`hotels`);
            return;
        } 
        else {
          const checkInParam = checkIn.toLocaleDateString('en-IN').replaceAll('/','-')
          const numNightsParam = getDateDifference(checkIn,checkOut)
          nav({
            pathname:`${data[n].slug.current}/`,
            search:createSearchParams({
              checkin:checkInParam,
              num_nights:numNightsParam,
              num_guests:guests,
              hotel_id:data[n].id,
            }).toString()
          })
        }
    }

    useEffect(() => {
        if (inView) {
            control.start('visible')
        } else {
            control.start('hidden')
        }
    }, [control, inView])

    useEffect(() => {
        setN(-1);
        const fetchedData = async () => {
            await client
                .fetch(
                    `*[_type == "hotel"] {
                      name,
                      slug,
                      id,
                      description,
                      images[]{
                        asset -> {url},
                      }
                    }`
                )
                .then((data) => setData(data))
                .then(() => {
                    control.start('visible')
                    setLoading(true)
                })
        }
        fetchedData()
    }, [])

    return (
      <div className="carouselBody" id="bookingBar">
        {loading && (
          <>
            <div className="bookingBar">
              <div onClick={onSubmit} className="arrowButton">
                <img src={arrow} alt={"StayBook Hotels"} />
                <p>Book Now</p>
              </div>

              <div className="line"></div>

              <div className="guests">
                <input type="number" value={guests} min="2" max="3" />
                <div className="change">
                  <div
                    onClick={() => {
                      guests === 2 ? setGuests(2) : setGuests((prev) => --prev)
                    }}
                    className="changeValue"
                    style={guests == 2 ? { color: "grey" } : { color: "black" }}
                  >
                    -
                  </div>
                  <img
                    src={guest}
                    style={{ height: "1.5rem" }}
                    alt={"StayBook Hotels"}
                  />
                  <div
                    onClick={() => {
                      guests === 4 ? setGuests(4) : setGuests((prev) => ++prev);
                    }}
                    className="changeValue"
                    style={guests == 4 ? { color: "grey" } : { color: "black" }}
                  >
                    +
                  </div>
                </div>
              </div>

              <div className="line"></div>

              <div className="input">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Check In"
                    value={checkIn}
                    inputFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    onChange={(newValue) => {
                      setCheckIn(newValue)
                      var element = document
                        .querySelector("#toOpen")
                        ?.querySelector("button");
                      simulateMouseClick(element);
                        
                    }}
                    renderInput={({ inputRef, inputProps, InputProps }) => (
                      <Box
                        sx={{
                          alignItems: "center",
                          display: "flex",
                          width: "10rem",
                          flexDirection: "column",
                        }}
                      >
                        <input
                          ref={inputRef}
                          {...inputProps}
                          placeholder="Check In"
                        />
                        {InputProps?.endAdornment}
                      </Box>
                    )}
                  />
                </LocalizationProvider>
                <div id="toOpen">
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      //views={["day", "month"]}
                      label="Check Out"
                      value={checkOut}
                      inputFormat="dd/MM/yyyy"
                      minDate={new Date().setDate(checkIn.getDate()+1)} //tommorow
                      onChange={(newValue) => setCheckOut(newValue)}
                      renderInput={({ inputRef, inputProps, InputProps }) => (
                        <Box
                          sx={{
                            alignItems: "center",
                            display: "flex",
                            width: "8rem",
                            flexDirection: "column",
                          }}
                        >
                          <input
                            ref={inputRef}
                            {...inputProps}
                            placeholder="Check Out"
                          />
                          {InputProps?.endAdornment}
                        </Box>
                      )}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              <div className="line"></div>

              <div className="search">
                <img
                  src={hotel}
                  style={{ height: "1.5rem" }}
                  alt={"StayBook Hotels"}
                />
                <input
                  onChange={(e) => {
                    const d = data.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                    );

                    if (e.target.value.toLowerCase().trim() == "") {
                      setN(-1);
                      return;
                    }
                    setSuggestions(d);
                    const n = data.indexOf(d[0]);
                    if (n != -1) {
                      setN(n);
                    }
                  }}
                  list="browse"
                  type="text"
                  placeholder="Search hotels in Delhi"
                />
                <datalist id="browse">
                  {suggestions.map((hotel, i) => (
                    <option key={i} value={hotel.name} />
                  ))}
                </datalist>
              </div>
            </div>
            <ul>
              <li>Homely Stay</li>
              <li>Breakfast</li>
              <li>Lunch</li>
              <motion.li
                ref={ref}
                variants={boxVariant}
                initial="hidden"
                animate={control}
              >
                Dinner & Party
              </motion.li>
            </ul>

            <div className="dish">
              <img
                style={{
                  transform:
                    "rotateZ(" + (translateY.current / 20).toString() + "deg)",
                }}
                src={
                  "https://res.cloudinary.com/deby9hi8w/image/upload/v1672233490/breakfast_jkcxzd.png"
                }
                alt={"StayBook Hotels"}
              />
            </div>

            <div className="bottle">
              <img
                style={{
                  transform:
                    "translateY(" +
                    (translateY2.current / 6).toString() +
                    "px)",
                }}
                src={
                  "https://res.cloudinary.com/deby9hi8w/image/upload/v1672233491/drink_ypa5vl.png"
                }
                alt={"StayBook Hotels"}
              />
              <img
                style={{
                  transform:
                    "translateY(" +
                    (translateY2.current / 6).toString() +
                    "px)",
                }}
                src={
                  "https://res.cloudinary.com/deby9hi8w/image/upload/v1672233602/drink-shadow_zzndnr.png"
                }
                alt={"StayBook Hotels"}
                className="shadowed"
              />
            </div>
          </>
        )}
      </div>
    );
}

export default BookingCarousel
