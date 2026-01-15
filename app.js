// DramaBox Streaming App
class DramaBoxApp {
    constructor() {
        this.apiBase = '/api';
        this.currentTab = 'random';
        this.currentDrama = null;
        this.episodes = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadInitialContent();
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e));
        });

        // Search functionality
        document.getElementById('search-btn').addEventListener('click', () => this.performSearch());
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Refresh button
        document.getElementById('refresh-btn').addEventListener('click', () => this.refreshCurrentTab());

        // Video modal
        document.getElementById('close-modal').addEventListener('click', () => this.closeVideoModal());

        // Click outside modal to close
        document.getElementById('video-modal').addEventListener('click', (e) => {
            if (e.target.id === 'video-modal') this.closeVideoModal();
        });
    }

    async loadInitialContent() {
        await this.loadTabContent('random');
    }

    async switchTab(e) {
        const tabName = e.target.closest('.tab-btn').dataset.tab;
        this.currentTab = tabName;

        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.closest('.tab-btn').classList.add('active');

        // Show corresponding content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-content`).classList.add('active');

        // Load content if not loaded yet
        await this.loadTabContent(tabName);
    }

    async loadTabContent(tabName) {
        const gridId = `${tabName}-grid`;
        const grid = document.getElementById(gridId);

        if (!grid || grid.children.length > 0) return;

        this.showLoading();

        try {
            let data;
            switch (tabName) {
                case 'random':
                    data = await this.fetchRandomDrama();
                    break;
                case 'foryou':
                    data = await this.fetchForYou();
                    break;
                case 'latest':
                    data = await this.fetchLatest();
                    break;
                case 'trending':
                    data = await this.fetchTrending();
                    break;
                case 'popular':
                    data = await this.fetchPopularSearch();
                    break;
            }

            this.renderDramaGrid(data, gridId);
        } catch (error) {
            console.error('Error loading content:', error);
            this.showError(gridId, 'Gagal memuat konten');
        } finally {
            this.hideLoading();
        }
    }

    async fetchRandomDrama() {
        const response = await fetch(`${this.apiBase}/dramabox/randomdrama`);
        return await response.json();
    }

    async fetchForYou() {
        const response = await fetch(`${this.apiBase}/dramabox/foryou`);
        return await response.json();
    }

    async fetchLatest() {
        const response = await fetch(`${this.apiBase}/dramabox/latest`);
        return await response.json();
    }

    async fetchTrending() {
        const response = await fetch(`${this.apiBase}/dramabox/trending`);
        return await response.json();
    }

    async fetchPopularSearch() {
        const response = await fetch(`${this.apiBase}/dramabox/populersearch`);
        return await response.json();
    }

    async performSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (!query) return;

        this.showLoading();

        try {
            const response = await fetch(`${this.apiBase}/dramabox/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();

            // Show search results
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById('search-content').classList.add('active');

            // Update active tab
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

            this.renderDramaGrid(data, 'search-grid');
        } catch (error) {
            console.error('Search error:', error);
            this.showError('search-grid', 'Gagal melakukan pencarian');
        } finally {
            this.hideLoading();
        }
    }

    renderDramaGrid(data, gridId) {
        const grid = document.getElementById(gridId);
        grid.innerHTML = '';

        if (!data || data.length === 0) {
            grid.innerHTML = '<p class="no-content">Tidak ada konten tersedia</p>';
            return;
        }

        data.forEach(drama => {
            const card = this.createDramaCard(drama);
            grid.appendChild(card);
        });
    }

    createDramaCard(drama) {
        const card = document.createElement('div');
        card.className = 'drama-card';

        // Handle both old and new API formats (popular search format)
        const thumbnail = drama.coverWap || drama.bookCover || drama.thumbnail || drama.image || 'https://via.placeholder.com/280x200/2a2a2a/ffffff?text=No+Image';
        const title = drama.bookName || drama.title || drama.name || 'Untitled';
        const popularity = drama.rankVo?.hotCode || drama.playCount || drama.rating || 'N/A';
        const totalEpisodes = drama.chapterCount || drama.totalChapterNum || drama.episodes || 'N/A';
        const protagonist = drama.protagonist || '';
        const tags = drama.tags ? drama.tags.slice(0, 3) : ['Drama'];

        // Format popularity (add icon based on type)
        let popularityDisplay = popularity;
        let popularityIcon = 'fas fa-eye';
        let popularityClass = 'popularity-normal';

        if (typeof popularity === 'string') {
            if (popularity.includes('K')) {
                popularityIcon = 'fas fa-fire';
                popularityClass = 'popularity-trending';
            } else if (popularity.includes('M')) {
                popularityIcon = 'fas fa-star';
                popularityClass = 'popularity-viral';
            }
        }

        // Truncate title if too long
        const truncatedTitle = title.length > 35 ? title.substring(0, 32) + '...' : title;

        card.innerHTML = `
            <div class="drama-thumbnail-container">
                <img src="${thumbnail}" alt="${title}" class="drama-thumbnail" onerror="this.src='https://via.placeholder.com/280x200/2a2a2a/ffffff?text=No+Image'">
                <div class="card-episode-count">${totalEpisodes} Eps</div>
                <div class="drama-overlay">
                    <div class="drama-popularity ${popularityClass}">
                        <i class="${popularityIcon}"></i>
                        <span>${popularityDisplay}</span>
                    </div>
                </div>
                ${drama.rankVo?.sort <= 3 ? `<div class="drama-rank">#${drama.rankVo.sort}</div>` : ''}
            </div>
            <div class="drama-info">
                <h3 class="drama-title" title="${title}">${truncatedTitle}</h3>
                ${protagonist ? `<div class="drama-protagonist"><i class="fas fa-user"></i> ${protagonist}</div>` : ''}
                <div class="drama-tags">
                    ${tags.map(tag => `<span class="drama-tag">${tag}</span>`).join('')}
                </div>
                <div class="drama-description">
                    <p>${drama.introduction ? drama.introduction.substring(0, 80) + '...' : 'Deskripsi tidak tersedia'}</p>
                </div>
                <div class="drama-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); app.playFirstEpisode(${JSON.stringify(drama).replace(/"/g, '&quot;')})">
                        <i class="fas fa-play-circle"></i>
                        <span>Tonton</span>
                    </button>
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); app.showAllEpisodes(${JSON.stringify(drama).replace(/"/g, '&quot;')})">
                        <i class="fas fa-list-ul"></i>
                        <span>Episode</span>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    async openDrama(drama) {
        this.currentDrama = drama;
        document.getElementById('video-title').textContent = drama.bookName || drama.title || drama.name || 'Untitled';

        this.showLoading();

        try {
            // For search results (new format), create episodes from available data
            if (drama.bookId || drama.cdnList) {
                this.episodes = this.createEpisodesFromSearchResult(drama);
            } else {
                // For old format, try to load episodes from API
                const dramaId = drama.bookId || drama.id || drama.drama_id;
                const response = await fetch(`${this.apiBase}/dramabox/allepisode?id=${dramaId}`);
                this.episodes = await response.json();
            }

            this.renderEpisodes();
            this.showVideoModal();

            // Auto-play first episode if available
            if (this.episodes && this.episodes.length > 0) {
                this.playEpisode(this.episodes[0]);
            }
        } catch (error) {
            console.error('Error loading episodes:', error);
            // Fallback: try to play the drama directly if episode loading fails
            if (drama.videoPath) {
                this.episodes = [{
                    title: 'Episode 1',
                    video_url: drama.videoPath,
                    url: drama.videoPath
                }];
                this.renderEpisodes();
                this.showVideoModal();
                this.playEpisode(this.episodes[0]);
            } else {
                this.showError('episode-list', 'Gagal memuat episode');
            }
        } finally {
            this.hideLoading();
        }
    }

    createEpisodesFromSearchResult(drama) {
        const episodes = [];

        // If drama has cdnList with video paths, create episodes from it
        if (drama.cdnList && drama.cdnList.length > 0) {
            const cdn = drama.cdnList[0]; // Use first CDN
            if (cdn.videoPathList && cdn.videoPathList.length > 0) {
                cdn.videoPathList.forEach((video, index) => {
                    episodes.push({
                        title: `Episode 1 - ${video.quality}p`,
                        video_url: video.videoPath,
                        url: video.videoPath,
                        quality: video.quality
                    });
                });
            }
        }

        // If no CDN list but has direct videoPath, create single episode
        if (episodes.length === 0 && drama.videoPath) {
            episodes.push({
                title: 'Episode 1',
                video_url: drama.videoPath,
                url: drama.videoPath
            });
        }

        // If still no episodes but we know total chapters, create placeholder episodes
        if (episodes.length === 0 && drama.totalChapterNum) {
            for (let i = 1; i <= Math.min(drama.totalChapterNum, 10); i++) {
                episodes.push({
                    title: `Episode ${i}`,
                    video_url: null,
                    url: null,
                    chapterId: drama.chapterId ? (parseInt(drama.chapterId) + i - 1).toString() : null
                });
            }
        }

        return episodes;
    }

    renderEpisodes() {
        const episodeList = document.getElementById('episode-list');
        episodeList.innerHTML = '';

        if (!this.episodes || this.episodes.length === 0) {
            episodeList.innerHTML = '<p class="no-content">Tidak ada episode tersedia</p>';
            return;
        }

        // Add episode count header
        const episodeHeader = document.createElement('div');
        episodeHeader.className = 'episode-header';
        episodeHeader.innerHTML = `
            <h4>Daftar Episode (${this.episodes.length})</h4>
            <p>Klik episode untuk menonton</p>
        `;
        episodeList.appendChild(episodeHeader);

        this.episodes.forEach((episode, index) => {
            const episodeItem = document.createElement('div');
            const hasVideo = episode.video_url || episode.url;
            const isAvailable = episode.available !== false && (hasVideo || episode.chapterId);

            episodeItem.className = `episode-item ${!isAvailable ? 'unavailable' : ''}`;
            episodeItem.onclick = () => isAvailable && this.playEpisode(episode);

            const qualityInfo = episode.quality ? ` (${episode.quality}p)` : '';
            const statusIcon = hasVideo ? '<i class="fas fa-play-circle"></i>' :
                             episode.chapterId ? '<i class="fas fa-clock"></i>' :
                             '<i class="fas fa-lock"></i>';

            episodeItem.innerHTML = `
                <div class="episode-number">${episode.episodeNumber || (index + 1)}</div>
                <div class="episode-content">
                    <div class="episode-title">${episode.title || `Episode ${episode.episodeNumber || (index + 1)}`}${qualityInfo}</div>
                    <div class="episode-status">
                        ${statusIcon}
                        <span>${hasVideo ? 'Tersedia' : episode.chapterId ? 'Tersedia' : 'Belum Tersedia'}</span>
                    </div>
                </div>
            `;

            episodeList.appendChild(episodeItem);
        });
    }

    playFirstEpisode(drama) {
        // Create episodes from drama data and play the first one
        const episodes = this.createEpisodesFromSearchResult(drama);

        if (episodes && episodes.length > 0) {
            this.currentDrama = drama;
            document.getElementById('video-title').textContent = drama.bookName || drama.title || drama.name || 'Untitled';
            this.episodes = episodes;
            this.renderEpisodes();
            this.showVideoModal();
            this.playEpisode(episodes[0]);
        } else {
            alert('Tidak ada episode yang tersedia untuk drama ini.');
        }
    }

    showAllEpisodes(drama) {
        // Navigate to episodes page with drama data
        const dramaData = encodeURIComponent(JSON.stringify(drama));
        window.location.href = `episodes.html?drama=${dramaData}`;
    }

    createNumberedEpisodes(drama) {
        const episodes = [];
        const totalEpisodes = drama.totalChapterNum || 10; // Default to 10 if not specified

        for (let i = 1; i <= totalEpisodes; i++) {
            episodes.push({
                title: `Episode ${i}`,
                episodeNumber: i,
                chapterId: drama.chapterId ? (parseInt(drama.chapterId) + i - 1).toString() : null,
                video_url: null,
                url: null,
                available: false
            });
        }

        return episodes;
    }

    playEpisode(episode) {
        const videoPlayer = document.getElementById('video-player');

        if (episode.video_url || episode.url) {
            videoPlayer.src = episode.video_url || episode.url;
            videoPlayer.load();
            videoPlayer.play();
        } else if (episode.chapterId) {
            // If no direct URL but we have chapterId, show a message
            console.log('Episode available but URL not loaded yet:', episode);
            alert('Episode ini tersedia tetapi URL video belum dimuat. Coba episode lain yang memiliki kualitas video.');
        } else if (!episode.available) {
            alert(`Episode ${episode.episodeNumber || episode.title} belum tersedia.`);
        } else {
            console.error('No video URL available for episode:', episode);
            alert('Video untuk episode ini tidak tersedia.');
        }
    }

    showVideoModal() {
        document.getElementById('video-modal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeVideoModal() {
        const videoPlayer = document.getElementById('video-player');
        videoPlayer.pause();
        videoPlayer.src = '';

        document.getElementById('video-modal').classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    async refreshCurrentTab() {
        const grid = document.getElementById(`${this.currentTab}-grid`);
        if (grid) {
            grid.innerHTML = '';
        }
        await this.loadTabContent(this.currentTab);
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('show');
    }

    showError(containerId, message) {
        const container = document.getElementById(containerId);
        container.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${message}</div>`;
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DramaBoxApp();
});

// Add some CSS for error messages and no content
const additionalStyles = `
.no-content {
    text-align: center;
    color: var(--text-muted);
    font-style: italic;
    padding: 2rem;
    grid-column: 1 / -1;
}

.error-message {
    text-align: center;
    color: #ff6b6b;
    padding: 2rem;
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.error-message i {
    font-size: 1.2rem;
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
