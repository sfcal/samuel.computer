// A post's videos behave like animated pictures: each plays, silently and on a
// loop, only while it is on screen, and is not downloaded until it is nearly
// there. Where this cannot be (a reader who asked for less motion, a phone
// saving power, no script at all) the video waits behind its controls instead.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const onScreen = new IntersectionObserver(entries => {
    for (const { target: video, isIntersecting } of entries) {
      if (!isIntersecting) video.pause();
      // a refusal to play unasked brings the controls back; being scrolled away mid-load is no refusal
      else video.play().catch(error => { if (error.name === 'NotAllowedError') video.controls = true; });
    }
  }, { rootMargin: '50% 0px' });

  for (const video of document.querySelectorAll('.prose video')) {
    video.controls = false;
    onScreen.observe(video);
  }
}
