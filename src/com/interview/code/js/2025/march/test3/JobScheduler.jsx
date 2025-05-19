// JobScheduler.jsx
import React, { useEffect, useState } from 'react';

// --- mock‑api helpers --------------------------------------------------------
const fetchLibraries = () =>
    new Promise(r => setTimeout(() => r(['LIB01', 'LIB02', 'LIB03', 'LIB04']), 300));

const fetchLPARs = () =>
    new Promise(r => setTimeout(() => r(['US1', 'US2', 'UK1', 'UK2']), 300));

const fetchJobs = () =>
    new Promise(r =>
        setTimeout(
            () =>
                r([
                    { name: 'JOBABC' },
                    { name: 'ORDER1' },
                    { name: 'BATCH$' },
                ]),
            300
        )
    );

// --- helpers -----------------------------------------------------------------
const jobNameRegex = /^[A-Z#@$][A-Z0-9#@$]{5,7}$/; // 6–8 chars, first char rule

const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
];

const weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

// --- main component ----------------------------------------------------------
export default function JobScheduler() {
    return (
        <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto', padding: 20 }}>
            <h2>Add Job Details</h2>
            <JobDetailsForm />

            <h2 style={{ marginTop: 40 }}>Add Calendar Schedule</h2>
            <CalendarScheduleForm />

            <h2 style={{ marginTop: 40 }}>Add Trigger to Job</h2>
            <TriggerForm />
        </div>
    );
}

// --- Form 1 ---------------------------------------------------------------
function JobDetailsForm() {
    const [libraries, setLibraries] = useState([]);
    const [lpars, setLpars] = useState([]);
    const [existingJobs, setExistingJobs] = useState([]);

    const [form, setForm] = useState({
        jobName: '',
        sysuid: 255,
        library: '',
        lpar: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchLibraries().then(setLibraries);
        fetchLPARs().then(setLpars);
        fetchJobs().then(setExistingJobs);
    }, []);

    const handleChange = e =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const validate = () => {
        const e = {};

        // Job Name
        if (!jobNameRegex.test(form.jobName))
            e.jobName =
                '6–8 chars, uppercase A‑Z/0‑9/#/@/$, first char A‑Z/#/@/$.';

        if (existingJobs.some(j => j.name === form.jobName))
            e.jobName = 'Must be unique – this job already exists.';

        // SYSUID
        if (form.sysuid === '' || +form.sysuid < 0 || +form.sysuid > 255)
            e.sysuid = '0–255 only.';

        if (!form.library) e.library = 'Required.';
        if (!form.lpar) e.lpar = 'Required.';

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (validate()) {
            alert(JSON.stringify(form, null, 2));
            setForm({ jobName: '', sysuid: 255, library: '', lpar: '' });
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Field
                label="Job Name"
                name="jobName"
                value={form.jobName}
                onChange={handleChange}
                error={errors.jobName}
            />

            <Field
                type="number"
                label="SYSUID"
                name="sysuid"
                value={form.sysuid}
                onChange={handleChange}
                error={errors.sysuid}
            />

            <Select
                label="Library"
                name="library"
                value={form.library}
                onChange={handleChange}
                options={libraries}
                error={errors.library}
            />

            <Select
                label="LPAR"
                name="lpar"
                value={form.lpar}
                onChange={handleChange}
                options={lpars}
                error={errors.lpar}
            />

            <button type="submit">Save Job</button>
        </form>
    );
}

// --- Form 2 ---------------------------------------------------------------
function CalendarScheduleForm() {
    const [frequency, setFrequency] = useState('Daily');
    const [time, setTime] = useState('00:00');

    // weekly
    const [weekDays, setWeekDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

    // monthly
    const [runMonths, setRunMonths] = useState([...months]);
    const [runType, setRunType] = useState('Calendar Day');
    const [runDays, setRunDays] = useState([1]);

    const handleSubmit = e => {
        e.preventDefault();
        const result =
            frequency === 'Daily'
                ? { frequency, time }
                : frequency === 'Weekly'
                    ? { frequency, time, weekDays }
                    : { frequency, time, runMonths, runType, runDays };
        alert(JSON.stringify(result, null, 2));
    };

    // helpers
    const toggleDay = d =>
        setWeekDays(prev =>
            prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
        );

    const toggleMonth = m =>
        setRunMonths(prev =>
            prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
        );

    const toggleRunDay = d =>
        setRunDays(prev =>
            prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
        );

    const weekShortcut = arr => setWeekDays(arr);

    const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => i + from);

    const runDayOptions =
        runType === 'Calendar Day'
            ? range(1, 31)
            : runType === 'Business Day'
                ? range(1, 22)
                : range(1, 5);

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Select
                label="Run Frequency"
                name="frequency"
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                options={['Daily', 'Weekly', 'Monthly']}
            />

            <Field
                type="time"
                label="Run Time"
                name="time"
                value={time}
                onChange={e => setTime(e.target.value)}
            />

            {frequency === 'Daily' && (
                <p style={{ marginLeft: 6 }}>All days (Mon–Sun) selected &amp; locked.</p>
            )}

            {frequency === 'Weekly' && (
                <>
                    <p style={{ margin: '8px 0 4px' }}>Shortcuts:</p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button type="button" onClick={() => weekShortcut(weekdays.slice(0, 5))}>
                            Mon–Fri
                        </button>
                        <button type="button" onClick={() => weekShortcut(['Sat', 'Sun'])}>
                            Sat–Sun
                        </button>
                        <button type="button" onClick={() => weekShortcut(weekdays.slice(0, 6))}>
                            Mon–Sat
                        </button>
                    </div>

                    <p style={{ margin: '12px 0 4px' }}>Select days:</p>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {weekdays.map(d => (
                            <label key={d}>
                                <input
                                    type="checkbox"
                                    checked={weekDays.includes(d)}
                                    onChange={() => toggleDay(d)}
                                />{' '}
                                {d}
                            </label>
                        ))}
                    </div>
                </>
            )}

            {frequency === 'Monthly' && (
                <>
                    <p style={{ margin: '12px 0 4px' }}>Run Months (toggle):</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                        {months.map(m => (
                            <label key={m}>
                                <input
                                    type="checkbox"
                                    checked={runMonths.includes(m)}
                                    onChange={() => toggleMonth(m)}
                                />{' '}
                                {m.substring(0, 3)}
                            </label>
                        ))}
                    </div>

                    <Fieldset legend="Run Type">
                        {['Calendar Day', 'Business Day', 'Weekdays'].map(t => (
                            <label key={t} style={{ marginRight: 14 }}>
                                <input
                                    type="radio"
                                    name="runType"
                                    value={t}
                                    checked={runType === t}
                                    onChange={e => setRunType(e.target.value)}
                                />{' '}
                                {t}
                            </label>
                        ))}
                    </Fieldset>

                    <p style={{ margin: '12px 0 4px' }}>
                        Days of Run (toggle):
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {runDayOptions.map(d => (
                            <label key={d}>
                                <input
                                    type="checkbox"
                                    checked={runDays.includes(d)}
                                    onChange={() => toggleRunDay(d)}
                                />{' '}
                                {d}
                            </label>
                        ))}
                    </div>
                </>
            )}

            <button type="submit" style={{ marginTop: 16 }}>
                Save Schedule
            </button>
        </form>
    );
}

// --- Form 3 ---------------------------------------------------------------
function TriggerForm() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState('');
    const [selectedFreq, setSelectedFreq] = useState('All Frequencies');

    const [freqOptions, setFreqOptions] = useState(['All Frequencies']);

    useEffect(() => {
        fetchJobs().then(js => {
            setJobs(js);
            if (js.length) setSelectedJob(js[0].name);
        });
    }, []);

    // when job changes, load its frequencies (mocked)
    useEffect(() => {
        if (!selectedJob) return;
        // fake: every job has F1,F2
        const f = ['FREQ‑1', 'FREQ‑2'];
        setFreqOptions(['All Frequencies', ...f]);
        setSelectedFreq('All Frequencies');
    }, [selectedJob]);

    const handleSubmit = e => {
        e.preventDefault();
        alert(JSON.stringify({ job: selectedJob, frequency: selectedFreq }, null, 2));
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Select
                label="Job Name"
                name="jobName"
                value={selectedJob}
                onChange={e => setSelectedJob(e.target.value)}
                options={jobs.map(j => j.name)}
            />

            <Select
                label="Frequency"
                name="frequency"
                value={selectedFreq}
                onChange={e => setSelectedFreq(e.target.value)}
                options={freqOptions}
            />

            <button type="submit">Add Trigger</button>
        </form>
    );
}

// --- shared UI -------------------------------------------------------------
function Field({ label, error, ...rest }) {
    return (
        <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontWeight: 600 }}>
                {label}
                <input
                    {...rest}
                    style={{ display: 'block', padding: 6, marginTop: 4, width: 220 }}
                />
            </label>
            {error && <span style={{ color: 'crimson', fontSize: 12 }}>{error}</span>}
        </div>
    );
}

function Select({ label, options, error, ...rest }) {
    return (
        <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontWeight: 600 }}>
                {label}
                <select
                    {...rest}
                    style={{ display: 'block', padding: 6, marginTop: 4, width: 226 }}
                >
                    <option value="">-- select --</option>
                    {options.map(o => (
                        <option key={o} value={o}>
                            {o}
                        </option>
                    ))}
                </select>
            </label>
            {error && <span style={{ color: 'crimson', fontSize: 12 }}>{error}</span>}
        </div>
    );
}

function Fieldset({ legend, children }) {
    return (
        <fieldset style={{ margin: '12px 0', padding: '6px 10px' }}>
            <legend style={{ fontWeight: 600 }}>{legend}</legend>
            {children}
        </fieldset>
    );
}
