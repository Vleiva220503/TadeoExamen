// src/AgoraRTC.js
import AgoraRTC from "agora-rtc-sdk-ng";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

const appId = "76a1ba55a4d747c2946c9ea7857d5889";

export async function joinChannel(channel, token, uid, handleUserPublished) {
  client.on("user-published", handleUserPublished);
  await client.join(appId, channel, token, uid);
  const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
  const localVideoTrack = await AgoraRTC.createCameraVideoTrack();
  await client.publish([localAudioTrack, localVideoTrack]);
  return [localAudioTrack, localVideoTrack];
}

export async function subscribeUser(user, handleTrackSubscribed) {
  await client.subscribe(user, "all");
  user.audioTrack && user.audioTrack.play();
  user.videoTrack && handleTrackSubscribed(user);
}

export async function leaveChannel() {
  await client.leave();
}

export async function toggleTrack(track) {
  if (track.isPlaying) {
    track.stop();
  } else {
    track.play();
  }
}

export { client };
