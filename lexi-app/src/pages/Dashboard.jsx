import { 
    Box, 
    Center, 
    Heading, 
    Image, 
    Flex, 
    Text,
    Stat,
    StatLabel,
    StatNumber,
    StatGroup,
    Spacer,
    Avatar,
    useBreakpointValue
} from "@chakra-ui/react"
import { useEffect } from "react";
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from "react-router-dom";
import UpcomingClass from "../components/UpcomingClass";
import Favorites from "../components/Favorites";


export default function Dashboard() {
    const isLargeScreen = useBreakpointValue({ base: false, xl: true });
    const { user, authToken } = useAuth();

    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken){
            navigate("/");
        }
    }, [])

    return <>
    <Box display="flex" m="10px" flexDirection={!isLargeScreen ? 'column' : 'row'}justifyContent="center">
        <Flex direction="column" maxW={isLargeScreen ? "500px" : undefined}>
            <Flex m="20px" bg="white" boxShadow='lg' direction="column" textAlign="center" p="30px" rounded={'xl'}>
                <Center>
                    <Avatar size="xl" bg="brand.700"src={user.profile_pic} mb="0px"></Avatar>
                </Center>
                <Center>
                    <Heading mt="10px" mb="3px"size="xl">Hello, {user.first_name}</Heading>
                </Center>
                <Text color="grey">Welcome to endless possibilities.</Text>
                <Box mt="20px">
                    <StatGroup> {/* Don't forget to add info about sessions of the student */}
                        <Stat rounded="xl" bg="teal.100" p="10px" m="10px">
                            <StatLabel fontSize="md">Minutes</StatLabel>
                            <StatNumber fontSize="3xl">345,670</StatNumber>
                        </Stat>

                        <Stat rounded="xl" bg="orange.100" p="10px" m="10px">
                            <StatLabel fontSize="md">Leasons</StatLabel>
                            <StatNumber fontSize="3xl">45</StatNumber>
                        </Stat>
                    </StatGroup>
                </Box>
            </Flex>
            <Box display="flex" alignItems="center" bg="brand.800" m="20px" p="20px" rounded={'xl'} boxShadow={'xl'}>
                <Image src="/img/flower.png" maxW="70px" mr={4}></Image>
                <Link to="/browse"><Box color="white">
                    <Heading fontSize={'xl'}>Explore Your Mentors</Heading>
                    <Text fontSize={'sm'}>Discover a Welcoming Tutor to Enhance Your English Journey</Text>
                </Box></Link>
            </Box>

        </Flex>
        
        <Box>
            {isLargeScreen && <Box m="20px" position="relative">
                <Image h="200px" filter="brightness(60%)" boxShadow="lg"rounded="xl" w="100%" objectFit="cover" src="/img/cover-3.gif"></Image>
                <Box color="white"  position="absolute" top="10%" p="50px" overflow="hidden">
                    <Heading>Learn. Grow. Thrive.</Heading>
                    <Text fontSize="lg">Watch your progress and growth in knowledge</Text>
                </Box>
            </Box>}
            <Box display="flex" flexDirection={!isLargeScreen ? 'column' : 'row'} m="20px" gap="20px"> {/* This is the box under the banner image */}
                <Box>
                    <Flex alignItems={"center"} mb={4}>
                        <Heading fontSize={"xl"}>Your Lessons</Heading>
                        <Spacer></Spacer>
                        <Link><Text>See all <ArrowForwardIcon/></Text></Link> {/* Add me a link */}
                    </Flex>
                    <UpcomingClass></UpcomingClass>
                </Box>
                <Spacer></Spacer>
                <Favorites></Favorites>
            </Box>
        </Box>
    </Box>
    </>
}