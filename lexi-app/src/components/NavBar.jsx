import { Spacer, Box, Button, Image, useBreakpointValue, Avatar } from '@chakra-ui/react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext';
import axios from "axios";
import { useEffect, useState } from 'react';
import MenuDisplay from './Menu';
import MenuButtonN from './MenuButton';

export default function NavBar() {
    const location = useLocation().pathname;
    const isSmallScreen = useBreakpointValue({ base: true, md: false });
    const { authToken, refresh, setUser } = useAuth();
    const [profilePic, setProfilePic] = useState("");


    const followup = (result) => {
        setUser(result.data);
        setProfilePic(result.data.profile_picture);
    }
    // This is marked as unhandled promise
    useEffect(() => {
        if (authToken) {
            const getProfile = async () => {
                try {
                    const result = await axios.get("http://127.0.0.1:5000/student/profile", { headers: { Authorization: "Bearer " + authToken } });
                    followup(result);
                } catch (error) {
                    if (error.response && error.response.status === 410) {
                        refresh()
                        .then(
                            data => {
                                axios.get("http://127.0.0.1:5000/student/profile", { headers: { Authorization: "Bearer " + data } })
                                .then(data => followup(data))
                                .then(_ => console.log('--------refresh session successfully from NavBar----->'))
                                .catch(err => console.log({err}))
                            }
                        ).catch();
                    }
                    console.error("An error occurred:", error.response.data);
                }
            };
            getProfile();
        }
    }, []);


    return (
        <Box display="flex" as="nav" alignItems="center" m="30px" p="30px" h="40px" bg="white" rounded="full" boxShadow='base'>
            <Box>
                <Link to='/'><Image src="/img/logo.png" alt="Logo" boxSize="auto" width="100px" height="auto" /></Link>
            </Box>
            <Spacer></Spacer>
            {isSmallScreen ? <MenuButtonN isloggedIn={Boolean(authToken)}/> : <>
                <Link to='/'><Button colorScheme='gray' color={(location === '/' || location === '/dashboard') ? 'brand.700' : 'black'} variant='ghost'>Home</Button></Link>
                <Link to='/browse'><Button colorScheme='gray' color={location === '/browse' ? 'brand.700' : 'black'} variant='ghost'>Browse a Tutor</Button></Link>
                <Link to='/mentor'><Button colorScheme='gray' color={location === '/mentor/join-us' ? 'brand.700' : 'black'} variant='ghost'>Join Us</Button></Link>
            </>}
            {authToken ? <Box ml={4} className="image-container">
                <MenuDisplay>
                    {profilePic ?
                        <Avatar size="sm" bg='red.500' src={profilePic}></Avatar>
                        : <>
                            <Image w="50px" src="/img/profile.gif" className="gif-image" ></Image>
                            <Image w="50px" src="/img/profile-still.png" className="still-image" ></Image>
                        </>
                    }
                </MenuDisplay>
            </Box> : !isSmallScreen &&
                <Box>
                    <Link to='/sign-in'><Button colorScheme='facebook' variant='outline' ml="10px">Login</Button></Link>
                    <Link to='/sign-up' ><Button colorScheme='facebook' ml="10px" variant='solid'>Sign up</Button></Link>
                </Box>
            }
        </Box>
    );
};