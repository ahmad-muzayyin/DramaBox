import http from './http';

// --- Interfaces ---

export interface Drama {
    bookId: string;
    bookName: string;
    coverWap: string;
    playCount: string;
    tags: string[];
    introduction: string;
    chapterCount?: number;
    score?: string; // Sometimes APIs return score
}

export interface DramaSection {
    columnId: number;
    title: string;
    bookList: Drama[];
}

export interface BaseResponse {
    columnVoList: DramaSection[];
    data?: any; // Fallback for differing structures
}


// --- API Functions ---

// 1. Home / VIP
export const getHomeData = async (): Promise<BaseResponse> => {
    return http.get('/dramabox/vip');
};

// 2. Dub Indo
// 2. Dub Indo
export const getDubIndo = async (): Promise<BaseResponse> => {
    return http.get('/dramabox/dubindo?classify=terbaru');
};

// 3. Random Drama
export const getRandomDrama = async (): Promise<BaseResponse> => {
    return http.get('/dramabox/randomdrama');
};

// 4. For You
export const getForYou = async (): Promise<BaseResponse> => {
    return http.get('/dramabox/foryou');
};

// 5. Trending
export const getTrending = async (): Promise<BaseResponse> => {
    return http.get('/dramabox/trending');
};

// 6. Latest (Latest Drama Endpoint if needed, sometimes same as trending)
export const getLatest = async (): Promise<BaseResponse> => {
    // If there is no specific /latest endpoint, we can use trending or foryou
    // But based on user request: /dramabox/trending is trending
    // Assuming for now user wants buttons for these.
    return http.get('/dramabox/trending');
};

// 7. Popular Search
export const getPopularSearch = async (): Promise<any[]> => {
    return http.get('/dramabox/populersearch');
};

// 8. Search
export const searchDramas = async (query: string): Promise<BaseResponse> => {
    return http.get(`/dramabox/search?query=${encodeURIComponent(query)}`);
};

// 9. Detail
export const getDramaDetail = async (bookId: string): Promise<any> => {
    return http.get(`/dramabox/detail?bookId=${bookId}`);
};

// 10. All Episodes
export const getAllEpisodes = async (bookId: string): Promise<any> => {
    return http.get(`/dramabox/allepisode?bookId=${bookId}`);
};
