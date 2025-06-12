import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const BreedingTree = ({ currentCow, suggestions }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!currentCow || !suggestions) return;

        // Clear previous tree
        d3.select(svgRef.current).selectAll("*").remove();

        // Set up the tree layout
        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 90, bottom: 30, left: 90 };

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create the tree data structure
        const treeData = {
            name: currentCow.tagId,
            children: [
                {
                    name: 'Parents',
                    children: [
                        { name: currentCow.parentTagId1 || 'Unknown' },
                        { name: currentCow.parentTagId2 || 'Unknown' }
                    ]
                },
                {
                    name: 'Suggested Matches',
                    children: suggestions.map(s => ({
                        name: s.tagId,
                        compatibility: s.compatibility,
                        geneticDiversity: s.geneticDiversity
                    }))
                }
            ]
        };

        // Create the tree layout
        const treeLayout = d3.tree()
            .size([height - margin.top - margin.bottom, width - margin.left - margin.right]);

        const root = d3.hierarchy(treeData);
        const treeNodes = treeLayout(root);

        // Add links
        svg.selectAll('.link')
            .data(treeNodes.links())
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x))
            .attr('fill', 'none')
            .attr('stroke', '#ccc')
            .attr('stroke-width', 1.5);

        // Add nodes
        const node = svg.selectAll('.node')
            .data(treeNodes.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y},${d.x})`);

        // Add circles
        node.append('circle')
            .attr('r', 10)
            .attr('fill', d => {
                if (d.data.name === currentCow.tagId) return '#10B981'; // Current cow
                if (d.data.name === 'Parents' || d.data.name === 'Suggested Matches') return '#6B7280'; // Categories
                if (d.parent.data.name === 'Suggested Matches') return '#F59E0B'; // Suggested matches
                return '#9CA3AF'; // Parents
            });

        // Add labels
        node.append('text')
            .attr('dy', '.31em')
            .attr('x', d => d.children ? -13 : 13)
            .attr('text-anchor', d => d.children ? 'end' : 'start')
            .text(d => d.data.name)
            .style('font-size', '12px')
            .style('fill', '#374151');

        // Add compatibility and genetic diversity for suggested matches
        node.filter(d => d.parent && d.parent.data.name === 'Suggested Matches')
            .append('text')
            .attr('dy', '1.5em')
            .attr('x', 13)
            .attr('text-anchor', 'start')
            .text(d => `Compatibility: ${d.data.compatibility}% | Genetic Diversity: ${d.data.geneticDiversity}%`)
            .style('font-size', '10px')
            .style('fill', '#6B7280');

    }, [currentCow, suggestions]);

    return (
        <div className="overflow-x-auto">
            <svg ref={svgRef} className="w-full"></svg>
        </div>
    );
};

export default BreedingTree; 