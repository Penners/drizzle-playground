import { useState, useEffect } from "react";
import { socket } from "./socket";
import { Virtuoso } from "react-virtuoso";
import AutoSizer from "react-virtualized-auto-sizer";

function App() {
  const [userInput, setUserInput] = useState<string>("");
  const [user, setUser] = useState<string>();
  const [messages, setMessages] = useState<
    {
      id: number;
      body: string;
      userHandle: string;
      createdAt: string;
    }[]
  >([]);

  useEffect(() => {
    const addMessage = (message: {
      id: number;
      body: string;
      userHandle: string;
      createdAt: string;
    }) => {
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
                console.log(height, width);
                return (
                  <>
                    <Virtuoso
                      style={{ height, width }}
                      data={messages}
                      followOutput={"auto"}
                      itemContent={(index, message) => {
                        return (
                          <div className="p-2 chat chat-start">
                            <div className="chat-header mb-1">
                              {message.userHandle}
                              <time className="text-xs opacity-50">
                                {" "}
                                {new Date(
                                  message.createdAt
                                ).toLocaleTimeString()}
                              </time>
                            </div>
                            <div className="chat-bubble">{message.body}</div>
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
            <div className="join w-full">
              <textarea
                className="textarea textarea-bordered w-full mr-2"
                placeholder="Message"
              ></textarea>
              <button className="btn btn-primary h-auto">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
