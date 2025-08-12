import React, { useState } from "react";
import { Play, CheckCircle, X } from "lucide-react";

const Tutorials = ({
  completedTutorials,
  setCompletedTutorials,
  tutorials,
}) => {
  const [activeVideo, setActiveVideo] = useState(null);

  // const [completedTutorials, setCompletedTutorials] = useState([]);

  const markComplete = (tutorialId) => {
    if (!completedTutorials.includes(tutorialId)) {
      setCompletedTutorials([...completedTutorials, tutorialId]);
    }
  };

  // Function to get video embed code based on type and URL
  const getVideoEmbed = (tutorial) => {
    if (!tutorial.videoUrl || tutorial.videoUrl === "YOUR_VIDEO_1_URL_HERE") {
      // Fallback placeholder
      return (
        <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
          <div className="text-center">
            <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Video tutorial placeholder</p>
            <p className="text-sm text-gray-500">
              Replace videoUrl in tutorial data
            </p>
          </div>
        </div>
      );
    }

    switch (tutorial.embedType) {
      case "youtube":
        // Extract video ID from YouTube URL
        const youtubeId =
          tutorial.videoUrl.split("v=")[1]?.split("&")[0] ||
          tutorial.videoUrl.split("/").pop();
        return (
          <iframe
            className="w-full aspect-video rounded-lg"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={tutorial.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );

      case "vimeo":
        // Extract video ID from Vimeo URL
        const vimeoId = tutorial.videoUrl.split("/").pop();
        return (
          <iframe
            className="w-full aspect-video rounded-lg"
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title={tutorial.title}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );

      case "direct":
        // For direct video files (mp4, etc.)
        return (
          <video className="w-full aspect-video rounded-lg" controls poster="">
            <source src={tutorial.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );

      default:
        return (
          <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
            <p className="text-gray-600">Unsupported video format</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Interactive Tutorials
        </h2>
        <p className="text-gray-600">
          Learn to use AI tools effectively with step-by-step guidance
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Start Guide
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-blue-600">1</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Watch Tutorials
            </h4>
            <p className="text-sm text-gray-600">
              Start with the basics and work through each tool
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-purple-600">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Practice</h4>
            <p className="text-sm text-gray-600">
              Try each tool with your own content
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-green-600">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Master</h4>
            <p className="text-sm text-gray-600">
              Integrate AI tools into your daily workflow
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Your Learning Progress
          </h3>
          <span className="text-sm text-gray-600">
            {completedTutorials.length} of {tutorials.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{
              width: `${(completedTutorials.length / tutorials.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => {
          const isCompleted = completedTutorials.includes(tutorial.id);
          return (
            <div
              key={tutorial.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-blue-600 font-medium">
                    {tutorial.duration}
                  </span>
                  {isCompleted && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {tutorial.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {tutorial.description}
                </p>

                <div className="space-y-2 mb-4">
                  <p className="text-xs font-medium text-gray-700">
                    Topics covered:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {tutorial.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveVideo(tutorial.id)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span className="text-sm">Watch</span>
                  </button>
                  {!isCompleted && (
                    <button
                      onClick={() => markComplete(tutorial.id)}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {tutorials.find((t) => t.id === activeVideo)?.title}
                </h3>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Video Embed Area */}
              <div className="mb-4">
                {getVideoEmbed(tutorials.find((t) => t.id === activeVideo))}
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  {tutorials.find((t) => t.id === activeVideo)?.description}
                </p>
                <p>
                  This tutorial will guide you through each feature step by
                  step.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tutorials;
