import { useState, useEffect } from "react";
import { socket } from "./socket";
import { Virtuoso } from "react-virtuoso";
import AutoSizer from "react-virtualized-auto-sizer";

interface Message {
  id: number;
  body: string;
  userHandle: string;
  createdAt: string;
}

function App() {
  const [userInput, setUserInput] = useState<string>("");

  const [chatInput, setChatInput] = useState<string>();
  const [user, setUser] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);

  console.log(chatInput);

  useEffect(() => {
    const addMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("message", addMessage);

    return () => {
      socket.off("message", addMessage);
    };
  }, []);

  return (
    <>
      {!user && (
        <div className="w-full flex min-h-screen">
          <div className="form-control m-auto">
            <label className="label">
              <span className="label-text">What is your name?</span>
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder="@username"
                className="input input-bordered w-full max-w-xs mr-2 "
                value={userInput}
                onChange={(e) => setUserInput(e.currentTarget.value)}
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (userInput.trim()) {
                    console.log("Success");

                    const tempUser = userInput.trimEnd().trimEnd();

                    setUser(tempUser);

                    socket.emit("join", {
                      user: tempUser,
                      foo: "bar",
                    });
                  }
                }}
              >
                Join
              </button>
            </div>
          </div>
        </div>
      )}
      {user && (
        <div className="w-full min-h-screen flex flex-col">
          <div className="navbar bg-base-300">
            <a className="btn btn-ghost normal-case text-xl">Penners</a>
          </div>
          <div className="flex-1">
            <AutoSizer>
              {({ height, width }) => {
                return (
                  <>
                    <Virtuoso
                      style={{ height, width }}
                      data={messages}
                      followOutput={"auto"}
                      itemContent={(index, message) => {
                        return (
                          <div
                            className={`p-2 chat ${
                              message.userHandle === user
                                ? "chat-end mr-auto"
                                : "chat-start"
                            }`}
                          >
                            <div className="chat-header mb-1">
                              {message.userHandle}
                              <time className="text-xs opacity-50">
                                {" "}
                                {new Date(
                                  message.createdAt
                                ).toLocaleTimeString()}
                              </time>
                            </div>
                            <div
                              className={`chat-bubble ${
                                message.userHandle === user
                                  ? "chat-bubble-primary"
                                  : ""
                              }`}
                            >
                              {message.body}
                            </div>
                          </div>
                        );
                      }}
                    />
                  </>
                );
              }}
            </AutoSizer>
          </div>
          <div className="p-2">
            <form
              className="join w-full"
              onSubmit={(e) => {
                e.preventDefault();

                socket.emit("message:send", {
                  body: chatInput,
                  userHandle: user,
                });
                setChatInput("");
              }}
            >
              <textarea
                className="textarea textarea-bordered w-full mr-2"
                placeholder="Message"
                value={chatInput}
                onChange={(e) => setChatInput(e.currentTarget.value)}
              ></textarea>
              <button className="btn btn-primary h-auto">Send</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
