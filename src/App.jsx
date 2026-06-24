import { useEffect, useMemo, useState } from "react";
import "./index.css";
import logo from "./assets/logo.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const criteria = [
  { name: "تحقيق الأهداف التشغيلية", short: "الأهداف", weight: 0.25 },
  { name: "جودة الخدمات المقدمة", short: "الجودة", weight: 0.2 },
  { name: "الالتزام بالخطط والتعليمات", short: "الالتزام", weight: 0.15 },
  { name: "سرعة الاستجابة ومعالجة الملاحظات", short: "الاستجابة", weight: 0.1 },
  { name: "التنسيق والتكامل مع اللجان الأخرى", short: "التنسيق", weight: 0.1 },
  { name: "رضا المستفيدين", short: "الرضا", weight: 0.1 },
  { name: "التوثيق والتقارير", short: "التوثيق", weight: 0.05 },
  { name: "المبادرات والتحسين المستمر", short: "التحسين", weight: 0.05 },
];

const committees = [
  {
    name: "لجنة المراقبة والمتابعة",
    shortName: "المراقبة والمتابعة",
    chartName: "المراقبة|والمتابعة",
    scores: [90, 80, 90, 100, 90, 100, 100, 100],
  },
  {
    name: "لجنة المسار الإلكتروني وبطاقات نسك",
    shortName: "المسار الإلكتروني",
    chartName: "المسار الإلكتروني|وبطاقات نسك",
    scores: [90, 80, 80, 80, 90, 90, 100, 100],
  },
  {
    name: "لجنة النقل",
    shortName: "النقل",
    chartName: "النقل",
    scores: [80, 80, 75, 80, 60, 60, 50, 50],
  },
  {
    name: "لجنة التفويج",
    shortName: "التفويج",
    chartName: "التفويج",
    scores: [95, 95, 95, 100, 100, 100, 100, 100],
  },
  {
    name: "لجنة الاستقبال",
    shortName: "الاستقبال",
    chartName: "الاستقبال",
    scores: [80, 70, 60, 60, 60, 60, 60, 60],
  },
  {
    name: "العمليات",
    shortName: "العمليات",
    chartName: "العمليات",
    scores: [60, 60, 60, 40, 60, 60, 60, 60],
  },
  {
    name: "CRM",
    shortName: "CRM",
    chartName: "CRM",
    scores: [100, 100, 90, 100, 100, 100, 100, 100],
  },
  {
    name: "لجنة المشاعر المقدسة",
    shortName: "المشاعر المقدسة",
    chartName: "المشاعر|المقدسة",
    scores: [100, 100, 100, 80, 100, 100, 100, 100],
  },
  {
    name: "فريق السعادة",
    shortName: "فريق السعادة",
    chartName: "فريق|السعادة",
    scores: [100, 100, 100, 100, 100, 100, 100, 100],
  },
];

const tabs = ["نظرة عامة", "أداء اللجان", "مقارنة الأداء", "تفاصيل اللجان"];

const pieColors = ["#6f2c96", "#9b59c8", "#c7a7e7", "#efe0fb"];

function finalScore(committee) {
  return committee.scores.reduce((sum, score, index) => {
    return sum + score * criteria[index].weight;
  }, 0);
}

function round1(value) {
  const number = Math.round(value * 10) / 10;
  return Number.isInteger(number) ? number.toFixed(0) : number.toFixed(1);
}

function levelOf(score) {
  if (score >= 90) return "متميز";
  if (score >= 75) return "فعّال";
  if (score >= 60) return "مقبول";
  return "بحاجة إلى تطوير";
}

function heatClass(value) {
  if (value >= 90) return "heat5";
  if (value >= 80) return "heat4";
  if (value >= 70) return "heat3";
  if (value >= 60) return "heat2";
  return "heat1";
}

export default function App() {
  const [active, setActive] = useState("نظرة عامة");
  const [selected, setSelected] = useState("فريق السعادة");

  const THEME_KEY = "committee-dark-mode-v2";

const [darkMode, setDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === null) {
    return true;
  }

  return savedTheme === "true";
});

useEffect(() => {
  localStorage.setItem(THEME_KEY, darkMode ? "true" : "false");
}, [darkMode]);

  const data = useMemo(() => {
    return committees.map((committee) => {
      const score = finalScore(committee);

      return {
        ...committee,
        score,
        scoreLabel: `${round1(score)}%`,
        level: levelOf(score),
      };
    });
  }, []);

  const current = data.find((item) => item.name === selected) || data[0];

  return (
    <div className={`page ${darkMode ? "dark" : ""}`}>
      <section className="board">
        <Header
          active={active}
          setActive={setActive}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {active === "نظرة عامة" && <Overview committees={data} />}

        {active === "أداء اللجان" && (
          <CommitteePage
            committees={data}
            current={current}
            selected={selected}
            setSelected={setSelected}
          />
        )}

        {active === "مقارنة الأداء" && <ComparePage committees={data} />}

        {active === "تفاصيل اللجان" && (
          <DetailsPage
            committees={data}
            current={current}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </section>
    </div>
  );
}

function Header({ active, setActive, darkMode, setDarkMode }) {
  return (
    <header className="topbar">
      <nav>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={active === tab ? "active" : ""}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        ))}

        <button
          type="button"
          className="themeToggle"
          onClick={() => setDarkMode((prev) => !prev)}
          title={darkMode ? "الوضع الفاتح" : "الوضع الليلي"}
        >
          {darkMode ? "☀" : "☾"}
        </button>
      </nav>

      <div className="brand">
        <div className="brandLogoBox">
          <img src={logo} alt="يسر المشاعر" className="brandLogo" />
        </div>

        <div className="brandText">
          <h1>لجنة الإسكان</h1>
          <p>لوحة تقييم الأداء - 1447 هـ</p>
        </div>
      </div>
    </header>
  );
}

function Overview({ committees }) {
  const ranked = [...committees].sort((a, b) => b.score - a.score);

  const average =
    committees.reduce((sum, committee) => sum + committee.score, 0) /
    committees.length;

  const excellentCount = committees.filter(
    (committee) => committee.score >= 90
  ).length;

  const needImprovementCount = committees.filter(
    (committee) => committee.score < 60
  ).length;

  const commitmentData = committees.map((committee) => ({
    name: committee.chartName,
    value: committee.scores[2],
  }));

  const criticalData = criteria
    .map((criterion, index) => ({
      name: criterion.short,
      value:
        committees.reduce((sum, committee) => {
          return sum + committee.scores[index];
        }, 0) / committees.length,
    }))
    .sort((a, b) => a.value - b.value);

  const levels = ["متميز", "فعّال", "مقبول", "بحاجة إلى تطوير"];

  const pie = levels
    .map((level) => ({
      name: level,
      value: committees.filter((committee) => committee.level === level).length,
    }))
    .filter((item) => item.value > 0);

  return (
    <main className="overviewGrid">
      <section className="leftPanel">
        <div className="statsGrid">
          <StatCard
            type="white"
            label="متوسط التقييم العام"
            value={`${round1(average)}%`}
          />

          <StatCard
            type="purple"
            label="أعلى لجنة"
            value={ranked[0].shortName}
            sub={`${ranked[0].scoreLabel} · ${ranked[0].level}`}
          />

          <StatCard
            type="softPurple"
            label="اللجان المتميزة"
            value={excellentCount}
            sub="درجة نهائية 90% فأعلى"
          />

          <StatCard
            type="white"
            label="تحتاج تطوير"
            value={needImprovementCount}
            sub="أقل من 60%"
          />
        </div>

        <section className="card commitmentCard">
          <ChartTitle title="مؤشر الالتزام" label="Commitment Index" />

          <ResponsiveContainer width="100%" height={235}>
            <BarChart
              data={commitmentData}
              margin={{ top: 12, right: 8, left: -14, bottom: 54 }}
            >
              <XAxis
                dataKey="name"
                tick={<ArabicTick />}
                interval={0}
                height={78}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="value" fill="#8b43b1" radius={[14, 14, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </section>

      <section className="card rankingCard">
        <ChartTitle title="ترتيب اللجان حسب الأداء" label="Committee Ranking" />

        <ResponsiveContainer width="100%" height={315}>
          <BarChart
            data={ranked}
            margin={{ top: 8, right: 10, left: -14, bottom: 66 }}
          >
            <XAxis
              dataKey="chartName"
              tick={<ArabicTick />}
              interval={0}
              height={90}
            />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value) => `${round1(value)}%`}
              labelFormatter={(label) => String(label).replace("|", " ")}
            />
            <Bar dataKey="score" fill="#6f2c96" radius={[16, 16, 16, 16]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="card criticalCard">
        <ChartTitle title="البنود الحرجة" label="Critical Items" />

        <ResponsiveContainer width="100%" height={255}>
          <BarChart
            data={criticalData}
            margin={{ top: 8, right: 8, left: -14, bottom: 30 }}
          >
            <XAxis dataKey="name" interval={0} tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value) => `${round1(value)}%`} />
            <Bar dataKey="value" fill="#b17ad0" radius={[14, 14, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="card pieCard">
        <ChartTitle title="توزيع مستويات الأداء" label="Performance Levels" />

        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={pie}
              innerRadius={58}
              outerRadius={92}
              dataKey="value"
              paddingAngle={5}
            >
              {pie.map((_, index) => (
                <Cell key={index} fill={pieColors[index]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="legend">
          {pie.map((item, index) => (
            <span key={item.name}>
              <i style={{ background: pieColors[index] }} />
              {item.name}: {item.value}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}

function CommitteePage({ committees, current, selected, setSelected }) {
  const chartData = criteria.map((criterion, index) => ({
    name: criterion.short,
    value: current.scores[index],
  }));

  return (
    <main className="detailsGrid">
      <SidePanel
        title="أداء اللجنة"
        committees={committees}
        selected={selected}
        setSelected={setSelected}
        current={current}
      />

      <section className="card fullChart">
        <ChartTitle
          title={`أداء ${current.name} حسب المعايير الثمانية`}
          label="Committee Criteria"
        />

        <ResponsiveContainer width="100%" height={505}>
          <BarChart
            data={chartData}
            margin={{ top: 14, right: 16, left: -8, bottom: 30 }}
          >
            <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="value" fill="#6f2c96" radius={[16, 16, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </main>
  );
}

function ComparePage({ committees }) {
  const ranked = [...committees].sort((a, b) => b.score - a.score);

  return (
    <main className="compareGrid">
      <section className="card heatmapCard">
        <ChartTitle
          title="خريطة الأداء الحرارية - اللجان × المعايير"
          label="Performance Heatmap"
        />

        <div className="heatmap">
          <div className="heatHead criterionHead">المعيار</div>

          {committees.map((committee) => (
            <div className="heatHead" key={committee.name}>
              {committee.chartName.split("|").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>
          ))}

          {criteria.map((criterion, criterionIndex) => (
            <HeatmapRow
              key={criterion.name}
              criterion={criterion}
              criterionIndex={criterionIndex}
              committees={committees}
            />
          ))}
        </div>
      </section>

      <section className="card indexCard">
        <ChartTitle title="مؤشر الأداء" label="Final Performance Index" />

        <ResponsiveContainer width="100%" height={275}>
          <BarChart
            data={ranked}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 54, bottom: 8 }}
          >
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="chartName"
              tickFormatter={(value) => String(value).replace("|", " ")}
              width={130}
              tick={{ fontSize: 11 }}
            />
            <Tooltip formatter={(value) => `${round1(value)}%`} />
            <Bar dataKey="score" fill="#6f2c96" radius={[0, 13, 13, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </main>
  );
}

function HeatmapRow({ criterion, criterionIndex, committees }) {
  return (
    <>
      <div className="criterionCell">
        <b>{criterion.name}</b>
        <small>وزن {Math.round(criterion.weight * 100)}%</small>
      </div>

      {committees.map((committee) => {
        const value = committee.scores[criterionIndex];

        return (
          <div className={`heatCell ${heatClass(value)}`} key={committee.name}>
            {value}
          </div>
        );
      })}
    </>
  );
}

function DetailsPage({ committees, current, selected, setSelected }) {
  const rows = criteria.map((criterion, index) => ({
    ...criterion,
    score: current.scores[index],
    weighted: current.scores[index] * criterion.weight,
    level: levelOf(current.scores[index]),
  }));

  return (
    <main className="detailsGrid">
      <SidePanel
        title="تفاصيل اللجان"
        committees={committees}
        selected={selected}
        setSelected={setSelected}
        current={current}
      />

      <section className="card listPanel">
        <ChartTitle
          title={`تفاصيل المعايير الثمانية - ${current.name}`}
          label="Eight Criteria Details"
        />

        <div className="criteriaList">
          {rows.map((row) => (
            <div className="itemRow" key={row.name}>
              <div>
                <b>{row.name}</b>
                <small>
                  الوزن {Math.round(row.weight * 100)}% · الدرجة الموزونة{" "}
                  {round1(row.weighted)}
                </small>
              </div>

              <div className="rowScore">
                <span>{row.score}%</span>
                <em>{row.level}</em>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="finalCard">
        <div>
          <h3>الدرجة النهائية</h3>
          <p>{current.level}</p>
        </div>

        <strong>{current.scoreLabel}</strong>
      </section>
    </main>
  );
}

function SidePanel({ title, committees, selected, setSelected, current }) {
  return (
    <section className="card sidePanel">
      <h3>{title}</h3>

      <label>اختيار اللجنة</label>

      <select
        value={selected}
        onChange={(event) => setSelected(event.target.value)}
      >
        {committees.map((committee) => (
          <option key={committee.name}>{committee.name}</option>
        ))}
      </select>

      <div className="panelResult">
        <span>اللجنة الحالية</span>
        <h2>{current.name}</h2>
        <b>{current.scoreLabel}</b>
        <p>{current.level}</p>
      </div>
    </section>
  );
}

function StatCard({ type, label, value, sub }) {
  return (
    <div className={`statCard ${type}`}>
      <p>{label}</p>
      <h2>{value}</h2>

      {sub && <span>{sub}</span>}

      <MiniLine light={type !== "white"} />
    </div>
  );
}

function MiniLine({ light }) {
  const data = [
    { v: 72 },
    { v: 78 },
    { v: 76 },
    { v: 84 },
    { v: 86 },
    { v: 83 },
    { v: 91 },
  ];

  return (
    <ResponsiveContainer width="100%" height={34}>
      <LineChart data={data}>
        <Line
          dataKey="v"
          stroke={light ? "rgba(255,255,255,.88)" : "#6f2c96"}
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ArabicTick({ x, y, payload }) {
  const lines = String(payload.value).split("|");

  return (
    <g transform={`translate(${x},${y + 12})`}>
      <text textAnchor="middle" fill="#6f607d" fontSize="11" fontWeight="700">
        {lines.map((line, index) => (
          <tspan key={line} x="0" dy={index === 0 ? 0 : 14}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

function ChartTitle({ title, label }) {
  return (
    <div className="chartTitle">
      <h3>{title}</h3>
      <span>{label}</span>
    </div>
  );
}