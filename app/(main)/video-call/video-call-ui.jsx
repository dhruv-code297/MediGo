"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function VideoCall({ sessionId, token }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const sessionRef = useRef(null);
  const publisherRef = useRef(null);

  const router = useRouter();
  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

  // Handle script load
  const handleScriptLoad = () => {
    setScriptLoaded(true);
    if (!window.OT) {
      toast.error("Failed to load Vonage Video API");
      setIsLoading(false);
      return;
    }
    initializeSession();
  };

  // Initialize video session (UNCHANGED LOGIC)
  const initializeSession = () => {
    if (!appId || !sessionId || !token) {
      toast.error("Missing required video call parameters");
      router.push("/appointments");
      return;
    }

    try {
      sessionRef.current = window.OT.initSession(appId, sessionId);

      sessionRef.current.on("streamCreated", (event) => {
        sessionRef.current.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "append",
            width: "100%",
            height: "100%",
          },
          (error) => {
            if (error) {
              toast.error(
                "Error connecting to other participant's stream"
              );
            }
          }
        );
      });

      sessionRef.current.on("sessionConnected", () => {
        setIsConnected(true);
        setIsLoading(false);

        publisherRef.current = window.OT.initPublisher(
          "publisher",
          {
            insertMode: "replace",
            width: "100%",
            height: "100%",
            publishAudio: isAudioEnabled,
            publishVideo: isVideoEnabled,
          },
          (error) => {
            if (error) {
              console.error("Publisher error:", error);
              toast.error(
                "Error initializing your camera and microphone"
              );
            }
          }
        );
      });

      sessionRef.current.on("sessionDisconnected", () => {
        setIsConnected(false);
      });

      sessionRef.current.connect(token, (error) => {
        if (error) {
          toast.error("Error connecting to video session");
        } else {
          if (publisherRef.current) {
            sessionRef.current.publish(
              publisherRef.current,
              (error) => {
                if (error) {
                  console.log("Error publishing stream:", error);
                  toast.error("Error publishing your stream");
                }
              }
            );
          }
        }
      });
    } catch (error) {
      toast.error("Failed to initialize video call");
      setIsLoading(false);
    }
  };

  // Toggle video (UNCHANGED)
  const toggleVideo = () => {
    if (publisherRef.current) {
      publisherRef.current.publishVideo(!isVideoEnabled);
      setIsVideoEnabled((prev) => !prev);
    }
  };

  // Toggle audio (UNCHANGED)
  const toggleAudio = () => {
    if (publisherRef.current) {
      publisherRef.current.publishAudio(!isAudioEnabled);
      setIsAudioEnabled((prev) => !prev);
    }
  };

  // End call (UNCHANGED)
  const endCall = () => {
    if (publisherRef.current) {
      publisherRef.current.destroy();
      publisherRef.current = null;
    }

    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }

    router.push("/appointments");
  };

  // Cleanup (UNCHANGED)
  useEffect(() => {
    return () => {
      if (publisherRef.current) {
        publisherRef.current.destroy();
      }
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };
  }, []);

  if (!sessionId || !token || !appId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
        <h1 className="text-3xl font-bold mb-4">
          Invalid Video Call
        </h1>
        <p className="text-slate-400 mb-6">
          Missing required parameters.
        </p>
        <Button
          onClick={() => router.push("/appointments")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Back to Appointments
        </Button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
        onLoad={handleScriptLoad}
        onError={() => {
          toast.error("Failed to load video call script");
          setIsLoading(false);
        }}
      />

      <div className="min-h-screen bg-slate-950 text-white px-6 py-10 relative overflow-hidden">

        {/* Blue glow background */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/10 blur-3xl rounded-full"></div>

        <div className="max-w-6xl mx-auto relative z-10 space-y-8">

          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              Video Consultation
            </h1>
            <p className="text-slate-400">
              {isConnected
                ? "Connected Securely"
                : isLoading
                ? "Connecting..."
                : "Connection Failed"}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && !scriptLoaded ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-blue-400 animate-spin mb-4" />
              <p className="text-slate-400">
                Loading secure connection...
              </p>
            </div>
          ) : (
            <>
              {/* Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Publisher */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                  <div className="px-4 py-2 text-blue-400 text-sm font-medium border-b border-slate-800 bg-blue-600/5">
                    You
                  </div>
                  <div
                    id="publisher"
                    className="w-full h-[320px] md:h-[420px] bg-slate-800"
                  >
                    {!scriptLoaded && (
                      <div className="flex items-center justify-center h-full">
                        <User className="h-16 w-16 text-blue-400 opacity-50" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Subscriber */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
                  <div className="px-4 py-2 text-slate-300 text-sm font-medium border-b border-slate-800 bg-slate-800">
                    Participant
                  </div>
                  <div
                    id="subscriber"
                    className="w-full h-[320px] md:h-[420px] bg-slate-800"
                  >
                    {(!isConnected || !scriptLoaded) && (
                      <div className="flex items-center justify-center h-full">
                        <User className="h-16 w-16 text-slate-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-6 mt-8">

                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleVideo}
                  className={`rounded-full h-14 w-14 border-slate-700 ${
                    !isVideoEnabled
                      ? "bg-red-600/20 border-red-600 text-red-400"
                      : ""
                  }`}
                  disabled={!publisherRef.current}
                >
                  {isVideoEnabled ? <Video /> : <VideoOff />}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleAudio}
                  className={`rounded-full h-14 w-14 border-slate-700 ${
                    !isAudioEnabled
                      ? "bg-red-600/20 border-red-600 text-red-400"
                      : ""
                  }`}
                  disabled={!publisherRef.current}
                >
                  {isAudioEnabled ? <Mic /> : <MicOff />}
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endCall}
                  className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700"
                >
                  <PhoneOff />
                </Button>
              </div>

              <div className="text-center text-slate-400 text-sm mt-4">
                {isVideoEnabled ? "Camera On" : "Camera Off"} •{" "}
                {isAudioEnabled ? "Microphone On" : "Microphone Off"}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}