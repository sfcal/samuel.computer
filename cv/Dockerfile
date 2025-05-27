# Use a TeXLive base image with full installation
FROM texlive/texlive:latest

# Install additional system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    git \
    make \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /cv

# Copy all CV files
COPY cv/ ./

# Create fonts directory if it doesn't exist
RUN mkdir -p fonts

# Install any missing LaTeX packages (these should mostly be included in texlive-full)
RUN tlmgr update --self && \
    tlmgr install \
    fontawesome5 \
    roboto \
    sourcesanspro \
    tcolorbox \
    environ \
    trimspaces \
    || true

# Create output directory
RUN mkdir -p output

# Default command to compile the CV
CMD ["xelatex", "-output-directory=output", "cv.tex"]