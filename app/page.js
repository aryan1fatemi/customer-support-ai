'use client'

import { Box,Stack } from "@mui/material";
import Image from "next/image";
import Chat from "./Chat";
import { useState } from "react";
export default function Home() {
  const [messages, setMessages] = useState([{role: 'assistant', content: "Hi! I'm the StarBucks support assistance. How can i help you?"}]);
  return (
    <Box
    height="100vh"
    width="100vw"
    display="flex"
    flexDirection="column"
    sx={{ border: '2px solid grey' }}>
      <Stack spacing={2} direction = "column">
        <Chat messages={messages} setMessages={setMessages}/>
      </Stack>
    </Box>
  );
}
