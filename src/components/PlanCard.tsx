import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { useAppDispatch } from '../app/hooks'
import { addPlan, removePlan } from '../app/planSlice'
import CheckIcon from '@mui/icons-material/Check';
import { v4 as uuid } from 'uuid';
import '../styles/PlanCard.scss'
import React from "react";

function PlanCard(this: any, { plan, room, amenities, maxCap, guests, checkIn, checkOut,key }: any) {
  const dispatch = useAppDispatch();
  const wind = window.matchMedia("(max-width: 800px)");
  const Plans = useAppSelector((state) => state.plans.selectedPlans);

  const getPrice = (
    date: Date,
    arrOfObjects: any,
    defaultPrice: number
  ): number => {

    date.setHours(23, 59, 59, 999);
    if (arrOfObjects === null) {
      return defaultPrice;
    }
    for (let i = 0; i < arrOfObjects.length; i++) {
      let startDate = new Date(arrOfObjects[i].starting_date);
      let endDate = new Date(arrOfObjects[i].ending_date);
      startDate.setHours(23, 59, 59, 999);
      endDate.setHours(23, 59, 59, 999);
      if (date >= startDate && date <= endDate) {
        return arrOfObjects[i].price;
      }
    }
    return defaultPrice;
  };
  
  useEffect(()=>{
    let newPlan = { ...plan, roomType: room, maxCap: maxCap, guests: guests };
    //count = count + 1;
    //setCount(count);
    //dispatch(addPlan(newPlan));
    console.log("key",key);
    if(plan.title =="EP Plan"){
      count = count + 1;
      setCount(count);
      dispatch(addPlan(newPlan));
    }
  },[])
  
  const unique_id = uuid();

  // const onClickHandler = () => {
    
  //   let newPlan = { ...plan, roomType: room, maxCap: maxCap, guests: guests };
  //   console.log("roomType", room, "maxCap", maxCap, "guests", guests);
  //   dispatch(addPlan(newPlan));

   
  // };

  
  let [count, setCount] = useState(0);
  const [epPlan,setEpPlan] = useState(0);
  

  //  let newPlan = { ...plan, roomType: "Superior King Room", maxCap: 9, guests: 2 };
  //  count = count + 1;
  //    setCount(count);
  //   dispatch(addPlan(newPlan));

 
   

  const incrementCount = () => {
    console.log("increment counter runs")
    let newPlan = { ...plan, roomType: room, maxCap: maxCap, guests: guests };
    console.log("roomType", room, "maxCap", maxCap, "guests", guests);
    count = count + 1;
    setCount(count);
    dispatch(addPlan(newPlan));
    
    
  }
  function decrementCount() {
    let newPlan = { ...plan, roomType: room, maxCap: maxCap, guests: guests };
    console.log("roomType", room, "maxCap", maxCap, "guests", guests);
    count = count - 1;
    setCount(count);
    dispatch(removePlan(newPlan));
  }

 

  return (
    <div className="planCard">
      <div style={{ width: "30%" }}>
        <h2>{plan.title}</h2>
        <p>{plan.info}</p>
      </div>
      {!wind.matches && (
        <div className="tooltip">
          Amenities
          <div className="tooltiptext">{amenities}</div>
        </div>
      )}
      {plan.features ? (
        <div className="features">
          {plan.features.map((feature: any,index:number) => (
            <span key={index}>
              <CheckIcon fontSize="inherit" /> {feature}
            </span>
          ))}
        </div>
      ) : null}

      <div className="row">
      <h2>
        
         ₹{getPrice(checkIn, plan.price_planner,plan.price)}
      </h2>

 

    

   
<div className="input-group">
  <input type="button" value="-" className="button-minus" data-field="quantity" onClick={decrementCount}/>
  {/* <input type="number" step="1" max="" value="1" name="quantity" className="quantity-field"/> */}
  <span  className="quantity-field">{count}</span>
  <input type="button" value="+" className="button-plus" data-field="quantity" onClick={incrementCount}/>
</div>
    
{/* <div className="button" onClick={onClickHandler} >
Select
</div> */}


</div>

    </div>
  );

  


  
}





export default PlanCard
