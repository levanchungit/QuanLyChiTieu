// MainScreen.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';

/** ---------- Types ---------- */
type Item = {
  id: string;
  name: string;
  amount: number;
  color: string;
  icon?: string;
};

type Segment = Item & { pct: number };

/** ---------- Palette ---------- */
const COLORS = {
  bg: '#f6f7f4',
  green: '#5b806a',
  greenDark: '#476555',
  red: '#e84a43',
  blue: '#5aaad6',
  card: '#ffffff',
  text: '#2b2b2b',
  sub: '#7a7a7a',
  fab: '#f7c234',
};

/** ---------- Mock data (replace with real data) ---------- */
const mockData = {
  totalAll: 2_541_000,
  rangeLabel: '22 thg 9 - 28 thg 9',
  totalThisPeriod: 167_000,
  items: [
    {
      id: 'khac',
      name: 'Khác',
      amount: 157_000,
      color: COLORS.red,
      icon: '❓',
    },
    { id: '4g', name: '4G', amount: 10_000, color: COLORS.blue, icon: '🌐' },
    {
      id: 'an-uong',
      name: 'Ăn uống',
      amount: 0,
      color: COLORS.green,
      icon: '🍔',
    },
    { id: 'di-chuyen', name: 'Di chuyển', amount: 0, color: COLORS.greenDark },
    { id: 'giai-tri', name: 'Giải trí', amount: 0, color: COLORS.fab },
  ] as Item[],
};

/** =======================================================================
 *  Screen
 *  ======================================================================= */
import type { DrawerScreenProps } from '@react-navigation/drawer';

type MainScreenProps = DrawerScreenProps<any>;

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const [period, setPeriod] = useState<
    'Ngày' | 'Tuần' | 'Tháng' | 'Năm' | 'Khoảng thời gian'
  >('Tuần');
  const [stateCPTN, setStateCPTN] = useState<'CHI PHÍ' | 'THU NHẬP'>('CHI PHÍ');
  const segments: Segment[] = useMemo(() => {
    const sum = mockData.items.reduce((s, i) => s + i.amount, 0) || 1;
    return mockData.items.map(i => ({ ...i, pct: i.amount / sum }));
  }, []);

  const formatDateVN = (date: Date) => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const formatter = new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'long',
    });

    const formatted = formatter.format(date); // ví dụ: "1 tháng 10"

    return isToday ? `Hôm nay, ${formatted}` : formatted;
  };

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e9f2eb' }}>
      {/* drawer Navigation */}
      <View style={{ position: 'absolute', top: 16, left: 8, zIndex: 10 }}>
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}
        >
          <Text style={{ fontSize: 24, margin: 16 }}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <TouchableOpacity>
            <Text style={styles.textTongCong}>Tổng cộng ▼</Text>
          </TouchableOpacity>
          <Text style={styles.headerMoney}>{formatVND(mockData.totalAll)}</Text>
        </View>

        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-start',
            flexDirection: 'row',
          }}
        >
          {(['CHI PHÍ', 'THU NHẬP'] as const).map(s => {
            const active = stateCPTN === s;
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setStateCPTN(s)}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  width: '50%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottomColor: 'white',
                  padding: 5,
                  borderBottomWidth: active ? 3 : 0,
                }}
              >
                <Text
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: active ? 'white' : 'gray',
                  }}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.containerCardWrap}>
        <View style={styles.cardWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.periodTabs}
          >
            {(
              ['Ngày', 'Tuần', 'Tháng', 'Năm', 'Khoảng thời gian'] as const
            ).map(p => {
              const active = period === p;
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPeriod(p)}
                  style={styles.periodTab}
                >
                  <Text
                    style={[
                      styles.periodText,
                      active && styles.periodTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                  {active && <View style={styles.periodUnderline} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity onPress={() => setOpen(true)}>
            <DatePicker
              modal
              open={open}
              date={date}
              mode="date"
              onConfirm={date => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
            <Text style={styles.rangeLabel}>{formatDateVN(date)}</Text>
          </TouchableOpacity>

          <View style={styles.donutWrap}>
            <Donut
              size={260}
              strokeWidth={26}
              segments={segments}
              centerLabel={formatVND(mockData.totalThisPeriod)}
            />
            <TouchableOpacity style={styles.fab} onPress={() => {}}>
              <Text style={{ fontSize: 28, lineHeight: 28, color: '#222' }}>
                ＋
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {segments.map(it => (
            <View key={it.id} style={styles.itemRow}>
              <View style={[styles.iconCircle, { borderColor: it.color }]}>
                <Text style={{ fontSize: 16 }}>{it.icon ?? '•'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{it.name}</Text>
              </View>
              <Text style={styles.itemPct}>{Math.round(it.pct * 100)}%</Text>
              <Text style={styles.itemAmount}>{formatVND(it.amount)}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MainScreen;

/** =======================================================================
 *  Donut
 *  ======================================================================= */
type DonutProps = {
  size?: number;
  strokeWidth?: number;
  segments: Segment[];
  centerLabel?: string;
};

const Donut: React.FC<DonutProps> = ({
  size = 240,
  strokeWidth = 24,
  segments,
  centerLabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let start = 0;
  const arcs = segments.map(s => {
    const length = s.pct * circumference;
    const dasharray = `${length} ${circumference - length}`;
    const dashoffset = -start;
    start += length;
    return { ...s, dasharray, dashoffset };
  });

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg
        width={size}
        height={size}
        style={{ transform: [{ rotateZ: '-90deg' }] }}
      >
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e9e9e9"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {arcs.map(a => (
          <Circle
            key={a.id}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={a.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={a.dasharray}
            strokeDashoffset={a.dashoffset}
            strokeLinecap="round"
          />
        ))}
      </Svg>

      <View style={styles.centerLabel}>
        <Text style={styles.centerMoney}>{centerLabel}</Text>
      </View>
    </View>
  );
};

/** ---------- Utils & Styles ---------- */
const formatVND = (n: number): string => n.toLocaleString('vi-VN') + ' đ';

const styles = StyleSheet.create({
  containerCardWrap: {
    flex: 1,
    position: 'relative',
    top: -36,
    padding: 10,
    gap: 10,
  },

  textTongCong: {
    color: '#e9f2eb',
    fontWeight: '600',
    fontSize: 18,
  },
  scene: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 32,
    backgroundColor: COLORS.green,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    alignItems: 'center',
    fontSize: 16,
    marginBottom: 2,
  },
  headerMoney: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  topTabs: {
    marginTop: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 4,
    alignSelf: 'flex-start',
    gap: 8,
  },
  topTabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  topTabBtnActive: {
    backgroundColor: '#ffffff',
  },
  topTabText: { color: '#e9f2eb', fontWeight: '600' },
  topTabTextActive: { color: COLORS.greenDark },

  cardWrap: {
    backgroundColor: 'white',
    borderRadius: 18,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  periodTabs: { paddingHorizontal: 8, alignItems: 'center' },
  periodTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  periodText: { fontSize: 16, color: '#7a7a7a' },
  periodTextActive: { color: COLORS.greenDark, fontWeight: '700' },
  periodUnderline: {
    height: 3,
    width: '90%',
    backgroundColor: COLORS.greenDark,
    borderRadius: 3,
    marginTop: 6,
  },

  rangeLabel: {
    textAlign: 'center',
    fontSize: 18,
    color: COLORS.greenDark,
    textDecorationLine: 'underline',
    marginTop: 8,
  },

  donutWrap: { marginTop: 12, alignItems: 'center', justifyContent: 'center' },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerMoney: { fontSize: 26, fontWeight: '700', color: COLORS.text },

  fab: {
    position: 'absolute',
    right: 4,
    bottom: 6,
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.fab,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  itemName: { fontSize: 16, color: COLORS.text },
  itemPct: { fontSize: 15, color: '#7a7a7a', width: 44, textAlign: 'right' },
  itemAmount: {
    fontSize: 16,
    fontWeight: '600',
    width: 110,
    textAlign: 'right',
  },
});
