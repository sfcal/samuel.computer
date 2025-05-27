# Use a TeXLive base image with full installation
FROM texlive/texlive:latest

# Install additional system dependencies and fonts
RUN apt-get update && apt-get install -y \
    wget \
    git \
    make \
    fontconfig \
    fonts-roboto \
    fonts-font-awesome \
    && rm -rf /var/lib/apt/lists/*

# Update font cache
RUN fc-cache -fv

# Set working directory
WORKDIR /cv

# Install any missing LaTeX packages
RUN tlmgr update --self && \
    tlmgr install \
    fontawesome5 \
    roboto \
    sourcesanspro \
    tcolorbox \
    environ \
    trimspaces \
    enumitem \
    xstring \
    xifthen \
    etoolbox \
    parskip \
    unicode-math

# Copy all CV files
COPY . ./

# Create output directory
RUN mkdir -p output

# Default command to compile the CV
CMD ["xelatex", "-output-directory=output", "cv.tex"]