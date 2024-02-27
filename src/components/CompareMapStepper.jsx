import * as React from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useState, useEffect } from 'react'

export default function CompareMapStepper(data) {


  const [activeDay, setActiveDay] = useState(0)
  const [activeLocation, setActiveLocation] = useState(0)
  const [stepperData, setStepperData] = useState(data.data.feeds)
  const [routes, setRoutes] = useState({})

  const handleDayChange = (day) => {
    setActiveDay(day);
    setActiveLocation(0); // Reset location stepper when day changes
  };

  const handleLocationChange = (location, day) => {
    setActiveLocation(location);
    setActiveDay(day);
  };

  const handleNext = () => {
    setActiveLocation((prevLocation) => prevLocation + 1);
  };

  const handleBack = () => {
    setActiveLocation((prevLocation) => prevLocation - 1);
  };

  const handleReset = () => {
    setActiveDay(0);
    setActiveLocation(0);
  }


  useEffect(() => {

    // console.log(data)
    // console.log(stepperData)
  
    const groupedByDay = stepperData.reduce((result, item) => {
      const { nthDay } = item;
      if (!result[nthDay]) {
        result[nthDay] = [];
      }
      result[nthDay].push(item);
      return result;
    }, {})

    setRoutes(groupedByDay)

    return () => {
    }
  }, [setRoutes])
  
  // const handleLast = () => {
  //   const lastDay = datas[0].routes.length -1
  //   setActiveDay(datas.length -1)
  //   console.log(lastDay)
  //   const lastRoute = datas[0].routes[lastDay].locations.length-1
  //   setActiveLocation(lastRoute);
  //   console.log(lastRoute)
  // };

  return (
    <Box sx={{ maxWidth: 400, marginBottom: 2, marginTop: 2, }}>
    <Stepper activeStep={activeDay} orientation="vertical">
      {Object.entries(routes).map(([key, route], index) => (
        <Step key={index}>
          <Typography onClick={() => handleDayChange(index)}>
            {`Day ${key}`}
          </Typography>
          <Stepper 
            sx={{
              width: '420px'
            }}
            activeStep={activeDay === index ? activeLocation : -1} orientation="vertical">
              {Object.values(route).map((rou, idx) => (
                <Step key={idx}>
                  <StepLabel onClick={() => handleLocationChange(idx, index)}>
                    <Typography>{rou.location}</Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography>{rou.content}</Typography>
                    <Box sx={{ mb: 2 }}>
                      <div>
                        <Button
                          disabled={activeLocation === route.length-1 }
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          다음
                          {/* {activeLocation === route.length - 1 ? '마지막' : '다음'} */}
                        </Button>
                        <Button
                          disabled={activeLocation === 0}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          이전
                        </Button>
                      </div>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
        </Step>
      ))}
    </Stepper>
    <Paper square elevation={0} sx={{ p: 3 }}>
      <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
        처음으로 가기
      </Button>
    </Paper>
  </Box>
        );
      }