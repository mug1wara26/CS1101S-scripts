// Never gonna give you up in 137 tokens
const get_digit = (int, n) => math_floor(int / math_pow(10, n) % 10);

play(consecutively(map(
  x => cello(
    list_ref(pair(81, enum_list(69, 77)),
      get_digit(
        list_ref(
          list(3468836318993631, 6316811134863631, 6313464036318993, 681134863),
          math_floor(x / 16)
        ),
        x % 16
      )
    ),
    (d => (d > 4 ? 25.263157894736842 : 2.1052631578947367) / math_pow(2, d))(
      get_digit(
        list_ref(
          list(466644445664444, 412333463244446, 346324444566444, 123246324444),
          math_floor(x / 15)
        ),
        x % 15
      )
    )
  ),
  enum_list(0, 56)
)));
