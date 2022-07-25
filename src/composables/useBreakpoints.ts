import { onMounted, ref } from "vue";

export function useBreakpoints() {
  const isMobile = ref<boolean>(false);
  enum breakPoints {
    mobile = 600,
  }
  function onResize(): void {
    isMobile.value = window.innerWidth > breakPoints.mobile;
  }
  onMounted(() => {
    onResize();
    window.addEventListener("resize", onResize, { passive: true });
  });

  return { isMobile };
}
