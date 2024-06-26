import { Box, Heading, Divider, FormLabel, Flex, Button, Select, useToast, Text, Input } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import useAxiosPrivate from "../utils/useAxiosPrivate";
import dayjs from "dayjs";

import utc from 'dayjs/plugin/utc';
import { useAuth } from '../AuthContext';
import axios from "axios";

export default function Availability(){
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const [input, setInput] = useState({});
    const executor = useAxiosPrivate();
    const [daysSelected, setDaysSelected] = useState([]);
    const { setUser, role } = useAuth();
    const checks = ["days", "startTime", "endTime"];
    const toast = useToast();

    const addtoarray = (name) => {
        if (daysSelected.includes(name)) {
            setDaysSelected(daysSelected.filter(item => item !== name));
        } else {
            setDaysSelected([...daysSelected, name]);
        }
    }

    const createTimes  = (start = "8:00", end = "22:00") => {
        let [startHour, startMinutes] = start.split(':').map(Number);
        let [endHour, endMinutes] = end.split(':').map(Number);
        const arrayOfTimes = [];


        for (let h = startHour, m = startMinutes; h < endHour; m += 30) {
            if (m >= 60) {
                m -= 60;
                h += 1;
            }
            arrayOfTimes.push(`${h}:${m.toString().padStart(2, '0')}`);
        }
        return arrayOfTimes;
    }

    const cleanup = (element, state=true) => {
        const localtimezoneoffset = dayjs().utcOffset();
        const differenceInHours = Math.floor(localtimezoneoffset / 60);

            let newtime = element.split(':').map(Number);
            if (state === true) {
                newtime[0] -= differenceInHours;
            } else {
                newtime[0] += differenceInHours;
            }

            newtime[1] = newtime[1].toString().padStart(2, '0')

            newtime = newtime.join(':')

        return newtime
    }


    const handleToast = () => {
        // add a promise rejection handler
        toast({
            title: "Your profile has been updated successfully!",
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    }


    const handleClick = () => {
        const startTime = cleanup(input.availability.startTime);
        const endTime = cleanup(input.availability.endTime);

        if (checks.every(value => input.availability[value])) {
            (async () => {
                try {
                    const response = await executor.put(`${role}/profile`, {...input, availability: {days: daysSelected, startTime: startTime, endTime: endTime}})
                    getProfile()
                    handleToast();
                  } catch (err) {
                    console.error(err);
                  }
            })();
        } 
    }

    const handleChange = (e) => {
        dayjs.extend(utc);
        const { name, value } = e.currentTarget;
        const availability = {...input.availability};

        availability[name] = value;
        setInput({...input, availability: availability});
    };

    const followup = (result) => {
        const availability = {...result.data.profile.availability};

        setUser(result.data.profile);
        setDaysSelected(result.data.profile.availability.days)
        
        if (availability.startTime) {
            availability.startTime = cleanup(availability.startTime, false);
        }
        if (availability.endTime) {
            availability.endTime = cleanup(availability.endTime, false);
        }

        setInput({...result.data.profile, availability: availability});
    }

    const handleInputChange = (e) => {
        const { name, value } = e.currentTarget;
        setInput({ ...input, [name]: value });
    }

    const getProfile = (async () => {
        try {
            const response = await executor.get(`/${role}/profile`)
            followup(response)
          } catch (err) {
            console.error(err);
          }
    });

    useEffect(()=>{
        getProfile();
    },[])


    return <Box  m="30px" mt="0px">
        <Heading fontSize="xl" mb={4}>Schedule Availability</Heading>
        <Divider orientation='horizontal' mb={4}/>
        <FormLabel>Days available</FormLabel>
        <Flex w="80%" mb={4} display="flex" gap={4} flexWrap="wrap" bg="#EDF2F6" p="10px" border="1px" borderColor='#bec3c9' rounded="md">
            {weekdays.map((day, index) => (
                <Button colorScheme='teal' variant='outline' size="sm" key={index} isActive={daysSelected.includes(day)} onClick={() => addtoarray(day)}>{day}</Button>
            ))}
        </Flex>
        <Box display={{md: "flex"}} gap={10} w="80%" mb={10}>
            <Box w="100%">
                <FormLabel>Starting time</FormLabel>
                <Select variant="filled" placeholder='Pick your start time' name="startTime" value={input?.availability?.startTime} onChange={handleChange}> 
                    {createTimes(undefined, (input?.availability?.endTime)).map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </Select>
            </Box>
            <Box w="100%">
                <FormLabel>Ending time</FormLabel>
                <Select variant="filled" placeholder='Pick your end time' name="endTime" value={input?.availability?.endTime} onChange={handleChange}> 
                    {createTimes((input?.availability?.startTime), undefined).map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </Select>
            </Box>
        </Box>
        <Box mt={10}  w="80%">
            <Heading fontSize="xl" mb={4}>Prepare a video introduction</Heading>
            <Divider orientation='horizontal' mb={4}/>
            <Text mb={4}>
                At LexiLink, a video introduction is required to showcase your unique teaching style and personality to prospective students. This personalized video is your opportunity to make a lasting impression and demonstrate your passion for teaching.
            </Text>
            <FormLabel>Provide a link to your uploaded video</FormLabel>
            <Input variant='filled' name="demo_video" value={input.demo_video} onChange={handleInputChange}></Input>
        </Box>
        <Flex justify="flex-end" mt={7}>
                <Button className="right-aligned" colorScheme="teal" onClick={handleClick}>Save</Button>
            </Flex>
    </Box>
}