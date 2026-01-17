
export const revalidate = 3600; 

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { YCCompany } from '@/types';

const YC_HIRING_API = 'https://yc-oss.github.io/api/companies/hiring.json';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
const query = searchParams.get('q')?.toLowerCase() || '';
    const filterYear = searchParams.get('year') || '';
    const filterIndustry = searchParams.get('industry')?.toLowerCase() || '';
    const filterRegion = searchParams.get('region')?.toLowerCase() || '';
    const filterStage = searchParams.get('stage')?.toLowerCase() || '';
    const filterTeamSizeMin = searchParams.get('teamSizeMin') || '';
    const filterTeamSizeMax = searchParams.get('teamSizeMax') || '';
    const filterStatus = searchParams.get('status')?.split(',').filter(Boolean) || [];
    const filterTopCompany = searchParams.get('topCompany') === 'true';
    const filterNonprofit = searchParams.get('nonprofit') === 'true';
    const filterTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const filterLaunchedAfter = searchParams.get('launchedAfter') || '';
    const filterLaunchedBefore = searchParams.get('launchedBefore') || '';
    const filterSubindustry = searchParams.get('subindustry')?.toLowerCase() || '';

    const response = await axios.get<YCCompany[]>(YC_HIRING_API);
    let allCompanies = response.data;

    // 1. Filter by Year (if provided)
    if (filterYear) {
        allCompanies = allCompanies.filter((company) => {
            const batch = company.batch?.toLowerCase() || '';
            // If user enters "2021", match "21". If "21", match "21".
            const shortYear = filterYear.length === 4 ? filterYear.substring(2) : filterYear;
            return batch.includes(shortYear);
        });
    }

    // 2. Filter by Industry
    if (filterIndustry) {
        allCompanies = allCompanies.filter((company) => {
             const industry = company.industry?.toLowerCase() || '';
             const industries = company.industries?.map(i => i.toLowerCase()).join(' ') || '';
             return industry.includes(filterIndustry) || industries.includes(filterIndustry);
        });
    }

    // 3. Filter by Region
    if (filterRegion) {
        allCompanies = allCompanies.filter((company) => {
             const regions = company.regions?.map(r => r.toLowerCase()).join(' ') || '';
             const loc = company.all_locations?.toLowerCase() || '';
             return regions.includes(filterRegion) || loc.includes(filterRegion);
        });
    }

// 4. Filter by Stage
    if (filterStage) {
        allCompanies = allCompanies.filter((company) => {
             const stage = company.stage?.toLowerCase() || '';
             return stage.includes(filterStage);
        });
    }

    // 5. Filter by Team Size Range
    if (filterTeamSizeMin || filterTeamSizeMax) {
        allCompanies = allCompanies.filter((company) => {
            const teamSize = company.team_size || 0;
            const min = parseInt(filterTeamSizeMin) || 0;
            const max = parseInt(filterTeamSizeMax) || Infinity;
            return teamSize >= min && teamSize <= max;
        });
    }

    // 6. Filter by Status
    if (filterStatus.length > 0) {
        allCompanies = allCompanies.filter((company) => 
            filterStatus.includes(company.status)
        );
    }

    // 7. Filter by Top Company
    if (filterTopCompany) {
        allCompanies = allCompanies.filter((company) => company.top_company);
    }

    // 8. Filter by Nonprofit
    if (filterNonprofit) {
        allCompanies = allCompanies.filter((company) => company.nonprofit);
    }

    // 9. Filter by Tags
    if (filterTags.length > 0) {
        allCompanies = allCompanies.filter((company) => 
            filterTags.some(tag => company.tags.includes(tag))
        );
    }

    // 10. Filter by Launch Date Range
    if (filterLaunchedAfter || filterLaunchedBefore) {
        allCompanies = allCompanies.filter((company) => {
            if (!company.launched_at) return false;
            const launchedYear = new Date(company.launched_at * 1000).getFullYear();
            const after = parseInt(filterLaunchedAfter) || 0;
            const before = parseInt(filterLaunchedBefore) || Infinity;
            return launchedYear >= after && launchedYear <= before;
        });
    }

    // 11. Filter by Subindustry
    if (filterSubindustry) {
        allCompanies = allCompanies.filter((company) => 
            company.subindustry?.toLowerCase().includes(filterSubindustry)
        );
    }

    // 5. General Search (q) - only if provided
    if (query) {
      allCompanies = allCompanies.filter((company) => {
        const name = company.name?.toLowerCase() || '';
        const industry = company.industry?.toLowerCase() || '';
        const industries = company.industries?.map(i => i.toLowerCase()).join(' ') || '';
        const regions = company.regions?.map(r => r.toLowerCase()).join(' ') || '';
        const stage = company.stage?.toLowerCase() || '';
        const oneLiner = company.one_liner?.toLowerCase() || '';
        const batch = company.batch?.toLowerCase() || '';

        // Year to Batch Map Logic for General Search
        let yearMatch = false;
        if (/^\d{4}$/.test(query)) {
            const shortYear = query.substring(2);
            yearMatch = batch.includes(shortYear);
        }

        return (
          name.includes(query) ||
          industry.includes(query) ||
          industries.includes(query) ||
          regions.includes(query) ||
          stage.includes(query) ||
          oneLiner.includes(query) ||
          batch.includes(query) ||
          yearMatch
        );
      });
    }

    // Sort by batch descending (Newest first)
    allCompanies.sort((a, b) => {
        const getScore = (batch: string) => {
            if (!batch || batch === 'Unspecified') return 0;
            const parts = batch.split(' ');
            if (parts.length < 2) return 0;
            const season = parts[0]; // Summer or Winter
            const year = parseInt(parts[1]);
            if (isNaN(year)) return 0;
            return year * 10 + (season === 'Summer' ? 2 : 1);
        };
        return getScore(b.batch) - getScore(a.batch);
    });
    
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCompanies = allCompanies.slice(startIndex, endIndex);

    return NextResponse.json({
      companies: paginatedCompanies,
      total: allCompanies.length,
      page,
      limit,
      totalPages: Math.ceil(allCompanies.length / limit)
    });
  } catch (error) {
    console.error('Error fetching YC hiring data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hiring data' },
      { status: 500 }
    );
  }
}

