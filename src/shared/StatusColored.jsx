import React from 'react'

    const statusColors = {
        "done": { bg: "bg-green-500", text: "text-green-500" },
        "in progress": { bg: "bg-yellow-500", text: "text-yellow-500" },
        "pending": { bg: "bg-red-500", text: "text-red-500" },
        "to do": { bg: "bg-blue-500", text: "text-blue-500" },
        "new": { bg: "bg-purple-500", text: "text-purple-500" },
        "default": { bg: "bg-gray-400", text: "text-gray-400" }
    };

    const StatusColored = ({ status }) => {
        const colors = statusColors[status] || statusColors.default;

        return (
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${colors.bg}`}></span>
                <span className={`text-xs font-medium ${colors.text}`}>{status}</span>
            </div>
        );
    };

export default StatusColored
