export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-200 p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="h-20 bg-white rounded-2xl animate-pulse"></div>
                <div className="flex gap-8">
                    <div className="flex-1 space-y-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 h-64 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-5"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-5"></div>
                                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                    <div className="w-80 hidden lg:block space-y-6">
                        <div className="bg-white rounded-2xl p-6 h-96 animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
