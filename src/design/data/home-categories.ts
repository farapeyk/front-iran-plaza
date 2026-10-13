const teacher = "/design/icons/cat-teacher.svg"
const music = "/design/icons/cat-music.svg"
const airplane = "/design/icons/cat-airplane.svg"
const heartAdd = "/design/icons/cat-heart-add.svg"
const profileCircle = "/design/icons/cat-profile-circle.svg"
const award = "/design/icons/cat-award.svg"
const scissor = "/design/icons/cat-scissor.svg"
const coffee = "/design/icons/cat-coffee.svg"
const money = "/design/icons/cat-money.svg"
const monitor = "/design/icons/cat-monitor.svg"
const camera = "/design/icons/cat-camera.svg"
const clock = "/design/icons/cat-clock.svg"
const car = "/design/icons/cat-car.svg"
const building = "/design/icons/cat-building.svg"
const lamp = "/design/icons/cat-lamp.svg"

/** Full Home category set from Figma 7174:15830 (RTL visual order handled by flex-row-reverse / justify-end) */
export const homeCategories = [
  { label: "کافه و رستوران", icon: coffee },
  { label: "مراکز زیبایی", icon: scissor },
  { label: "باشگاه ورزشی", icon: award },
  { label: "پزشکان", icon: profileCircle },
  { label: "مراکز پزشکی", icon: heartAdd },
  { label: "تفریح و سفر", icon: airplane },
  { label: "هنر و موسیقی", icon: music },
  { label: "مراکز آموزشی", icon: teacher },
  { label: "دکوراسیون", icon: lamp },
  { label: "خدمات ساختمان", icon: building },
  { label: "خدمات خودرو", icon: car },
  { label: "پوشاک و اکسسوری", icon: clock, active: true },
  { label: "خدمات عمومی", icon: camera },
  { label: "لوازم خانگی", icon: monitor },
  { label: "مالی و حسابداری", icon: money },
] as const
